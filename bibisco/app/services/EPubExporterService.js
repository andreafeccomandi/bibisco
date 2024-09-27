/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('EPubExporterService', function (BibiscoPropertiesService,
  ChapterService, ContextService, ExportService, FileSystemService, ImageService, LocaleService, ProjectService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;
  const Epub = require('epub-gen');
  const PROLOGUE_FILE_NAME = 'p';
  const EPILOGUE_FILE_NAME = 'e';
  const ENDNOTES_FILE_NAME = 'n';

  return {

    export: function (exportpath, callback) {

      let projectLanguage = ProjectService.getProjectInfo().language;

      let translation = JSON.parse(FileSystemService.readFile(LocaleService.getResourceFilePath(projectLanguage)));
      let tocTitle = translation.epub_index;
      let commonChapterLabel = translation.common_chapter;
      let chapterTitleFormat = BibiscoPropertiesService.getProperty('chaptertitleformat');

      let novelfilepath = ExportService.calculateExportFilePath(exportpath, 'novel', new Date());
      
      let projectInfo = ProjectService.getProjectInfo();
      let novelTitle = projectInfo.name;
      let novelAuthor = projectInfo.author;
      let novelPublisher = projectInfo.publisher;
      let novelCopyright= projectInfo.copyright;
      let novelRights = projectInfo.rights;
      let novelIsbn = projectInfo.isbn;
      let novelWebsite = projectInfo.website;
      let novelLanguage = projectLanguage;
      let novelCover = this.getCoverFilename();

      let novelHtml = [];
      if (novelCover) {
        this.createCoverPage(novelHtml, novelCover);
      }
      this.createFirstPage(novelHtml, novelTitle, novelAuthor, novelPublisher, novelCopyright, novelRights, novelIsbn, novelWebsite);
      this.createChaptersForEPub(novelHtml, commonChapterLabel, chapterTitleFormat);

      let epubTemplatePath = FileSystemService.concatPath(ContextService.getAppPath(), 'epubtemplates');
      let tempDir = ContextService.getTempDirectoryPath();
      
      let option = {
        title: novelTitle,
        author: novelAuthor,
        content: novelHtml,
        tocTitle: tocTitle,
        lang: novelLanguage,
        verbose: 1,
        css: this.calculateEpubCSS(),
        customHtmlTocTemplatePath: FileSystemService.concatPath(epubTemplatePath, 'toc.xhtml.ejs'),
        customOpfTemplatePath: FileSystemService.concatPath(epubTemplatePath, 'content.opf.ejs'),
        tempDir: tempDir
      };
      
      if (novelCover) {
        option.cover = novelCover;
      }
      if(novelPublisher) {
        option.publisher = novelPublisher;
      }

      let epubFilename = novelfilepath + '.epub';
      new Epub(option, epubFilename).promise.then(
        function() {
          ipc.send('showItemInFolder', epubFilename);
          if (callback) {
            callback();
          }
        }
      );
    },

    calculateEpubCSS: function() {

      let indent = BibiscoPropertiesService.getProperty('indentParagraphEnabled') === 'true';
      let linespacing = BibiscoPropertiesService.getProperty('linespacing');
      let paragraphspacing = BibiscoPropertiesService.getProperty('paragraphspacing');
      let chapterpositionstyle = ExportService.calculateTitlePositionStyle(BibiscoPropertiesService.getProperty('chaptertitleposition'));
      let scenepositionstyle = ExportService.calculateTitlePositionStyle(BibiscoPropertiesService.getProperty('scenetitleposition'));

      let css = 'h1 {';
      css += chapterpositionstyle;
      css += '} ';

      css += 'h2 {';
      css += scenepositionstyle;
      css += '} ';
      
      css += '[style*="text-align: center"], [style*="text-align:center"] { text-indent: initial !important; } ';
      css += 'p {';
      if (indent) {
        css += 'text-indent: 30px; ';
      }

      switch(linespacing) {
      case 10:
        css += 'line-height: 1em; ';
        break;
      case 13:
        css += 'line-height: 1.3em; ';
        break;
      case 14:
        css += 'line-height: 1.4em; ';
        break;
      case 15:
        css += 'line-height: 1.5em; ';
        break;
      case 20:
        css += 'line-height: 2em; ';
        break;
      }

      css += 'margin-top: 0em; ';
      switch(paragraphspacing) {
      case 'none':
        css += 'margin-bottom: 0em;';
        break;
      case 'small':
        css += 'margin-bottom: 0.25em;';
        break;
      case 'medium':
        css += 'margin-bottom: 0.5em;';
        break;
      case 'big':
        css += 'margin-bottom: 0.75em;';
        break;
      case 'double':
        css += 'margin-bottom: 1em;';
        break;
      }

      css += '}';

      return css;
    },

    createCoverPage: function(novelHtml, novelCover) {
      
      // read binary data
      let bitmap = FileSystemService.readFile(novelCover);
      let coverBase64 = new Buffer(bitmap).toString('base64');

      let coverPage = {};
      coverPage.title = ' ';
      coverPage.data = '<img src="' + novelCover + '" />';
      coverPage.beforeToc = true;

      novelHtml.push(coverPage);
    },

    createFirstPage: function(novelHtml, title, author, publisher, copyright, rights, isbn, website) {
      
      let firstPage = {};
      firstPage.title = title;
      firstPage.data = '<p>'+author+'</p>';
      if (publisher) {
        firstPage.data += '<p>'+publisher+'</p>';
      }
      if (copyright) {
        firstPage.data += '<p>'+copyright+'</p>';
      }
      if (rights) {
        firstPage.data += '<p>'+rights+'</p>';
      }
      if (isbn) {
        firstPage.data += '<p>ISBN: '+isbn+'</p>';
      }
      if (website) {
        firstPage.data += '<p>'+website+'</p>';
      }

      firstPage.beforeToc = true;

      novelHtml.push(firstPage);
    },

    createChaptersForEPub: function (novelHtml, commonChapterLabel, chapterTitleFormat) {


      // footendnotes counter: I create it as object to pass it as reference
      let footnotes = {
        counter: 0,
        notes: [],
        footendnotemode: BibiscoPropertiesService.getProperty('epubnoteexport'),
        bookendtitle: BibiscoPropertiesService.getProperty('bookendtitle')
      };

      // scene separator
      let scenesconfig = {
        separator: ExportService.calculateSceneSeparator(),
        exporttitle: BibiscoPropertiesService.getProperty('exportscenetitle'),
        titleformat: BibiscoPropertiesService.getProperty('scenetitleformat'),
        titleposition: BibiscoPropertiesService.getProperty('scenetitleposition')
      };
      
      // prologue
      let prologue = ChapterService.getPrologue();
      if (prologue) {
        let prologueChapter = {};
        prologueChapter.title = prologue.title;
        prologueChapter.data = this.getChapterData({id: prologue.$loki, position: 'prologue'}, scenesconfig, footnotes, PROLOGUE_FILE_NAME);
        prologueChapter.type = 'chapter';
        prologueChapter.filename = PROLOGUE_FILE_NAME;
        novelHtml.push(prologueChapter);
      }

      // parts and chapters
      let partsEnabled = ChapterService.getPartsCount()>0 ? true : false;
      let parts = ChapterService.getParts();
      let chapters = ChapterService.getChapters();
      let lastPart = -1;
      let partLastChapterPosition = null;
      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          if (partsEnabled && (lastPart===-1 || chapters[i].position>partLastChapterPosition)) {
            lastPart += 1;
            partLastChapterPosition = ChapterService.getPartLastChapterPosition(parts[lastPart].$loki);
            let singlePart = {};
            singlePart.title = parts[lastPart].title;
            singlePart.data = '';
            singlePart.type = 'part';
            novelHtml.push(singlePart);
          } 

				  let singleChapter = {};
          let singleChapterFilename = ''+(i+1);
          singleChapter.title = this.calculateChapterTitle(chapterTitleFormat, chapters[i].title, chapters[i].position, commonChapterLabel);
				  singleChapter.data = this.getChapterData({id: chapters[i].$loki, position: chapters[i].position}, scenesconfig, footnotes, singleChapterFilename);
          singleChapter.type = (partsEnabled && chapters[i].position===partLastChapterPosition) ? 'partlastchapter' : 'chapter';
          singleChapter.filename = singleChapterFilename;
          novelHtml.push(singleChapter);
        }
      }

      // epilogue
      let epilogue = ChapterService.getEpilogue();
      if (epilogue) {
        let epilogueChapter = {};
        epilogueChapter.title = epilogue.title;
        epilogueChapter.data = this.getChapterData({id: epilogue.$loki, position: 'epilogue'}, scenesconfig, footnotes, EPILOGUE_FILE_NAME);
        epilogueChapter.type = 'chapter';
        epilogueChapter.filename = EPILOGUE_FILE_NAME;
        novelHtml.push(epilogueChapter);
      }

      // end notes
      if (footnotes.footendnotemode === 'bookend' && footnotes.notes.length > 0) {
        let endnoteChapter = {};
        endnoteChapter.title = footnotes.bookendtitle;
        endnoteChapter.data = '<section>';
        for (let i = 0; i < footnotes.notes.length; i++) {
          endnoteChapter.data += footnotes.notes[i];
        }
        endnoteChapter.data += '</section>';
        endnoteChapter.type = 'chapter';
        endnoteChapter.filename = ENDNOTES_FILE_NAME;
        novelHtml.push(endnoteChapter);
      }
    },


    calculateChapterTitle: function(chaptertitleformat, title, position, commonChapterLabel) {
      let chaptertitle;
      switch (chaptertitleformat) {
      case 'numbertitle':
        chaptertitle = position + '. ' + title; 
        break;
      case 'number':
        chaptertitle = position+'';
        break;
      case 'title':
        chaptertitle = title;
        break;
      case 'labelnumber':
        chaptertitle = commonChapterLabel + ' ' + position;
        break;
      }
      return chaptertitle;
    },

    calculateSceneTitle: function(scenetitleformat, title, chapterposition, sceneposition) {
      
      if (chapterposition === 'prologue' || chapterposition === 'epilogue') {
        return title;
      } 
      
      let scenetitle;
      let position = chapterposition + '.' + sceneposition;
      switch (scenetitleformat) {
      case 'numbertitle':
        scenetitle = position + ' ' + title; 
        break;
      case 'number':
        scenetitle = position;
        break;
      case 'title':
        scenetitle = title;
        break;
      }
      return scenetitle;
    },

    getChapterData: function(chapterconfig, scenesconfig, footnotes, chapterFilename) {
      let data = '';
      let scenes = ChapterService.getScenes(chapterconfig.id);
      for (let j = 0; j < scenes.length; j++) {
        if (scenesconfig.exporttitle === 'true') {
          let scenetitle = this.calculateSceneTitle(scenesconfig.titleformat, scenes[j].title, chapterconfig.position, (j+1));
          data += '<h2>'+scenetitle+'</h2>';
        }
        let text = ImageService.updateAllImageSrcToLocalPath(scenes[j].revisions[scenes[j].revision].text);
        text = this.removeHighlightedText(text);
        text = this.manageNotes(text, footnotes, chapterFilename);
        data += text;
        if (j < (scenes.length - 1)) {
          data += '<p style="text-align: center">'+scenesconfig.separator+'</p>';
        }
      }

      if (footnotes.footendnotemode === 'chapterend' && footnotes.notes.length > 0) {
        data += '<section><hr>';
        for (let i = 0; i < footnotes.notes.length; i++) {
          data += footnotes.notes[i];
        }
        data += '</section>';
        
        // remove the footnotes from this chapter
        footnotes.notes = [];
      }

      return data;
    },

    getCoverFilename: function() {
      let coverImage = ProjectService.getProjectInfo().coverImage;
      if (coverImage) {
        return ImageService.getImageFullPath(coverImage);
      } else {
        return null;
      }
    },

    manageNotes: function(inputHtml, footnotes, chapterFilename) {
      // create a temporary element to parse the HTML code
      let tempElement = document.createElement('div');
      tempElement.innerHTML = inputHtml;

      // select all <span> elements with a "data-isnote" attribute set
      let spans = tempElement.querySelectorAll('span[data-isnote]');

      for (let i = 0; i < spans.length; i++) {
        footnotes.counter++;

        let noteIdPrefix;
        if (footnotes.footendnotemode === 'chapterend') {
          noteIdPrefix = chapterFilename + '.xhtml';
        } else if (footnotes.footendnotemode === 'bookend') {
          noteIdPrefix = ENDNOTES_FILE_NAME + '.xhtml';
        }

        let noteId = 'footnote'+footnotes.counter;
        let noteRefId = 'ref'+footnotes.counter;

        spans[i].innerHTML = '<sup><a href="'+noteIdPrefix+'#'+noteId+'" id="'+noteRefId+'">'
          +footnotes.counter+'</a></sup>';

        let note = '<p id="'+noteId+'"><sup>'+footnotes.counter+'</sup> '+spans[i].getAttribute('data-note')
          +'<a href="'+chapterFilename+'.xhtml#'+noteRefId+'">↩</a></p>';
        footnotes.notes.push(note);
      }

      // return the modified HTML code
      return tempElement.innerHTML;
    },

    removeHighlightedText: function(inputHtml) {

      // create a temporary element to parse the HTML code
      let tempElement = document.createElement('div');
      tempElement.innerHTML = inputHtml;
    
      // select all <span> elements with a "style" attribute set
      let spans = tempElement.querySelectorAll('span[style]');
    
      // modify the "style" attributes of the spans
      for (let i = 0; i < spans.length; i++) {
        // check if the image has a "filename" attribute
        let style = spans[i].getAttribute('style');
        if (style) {
          spans[i].style = '';
        }
      }
    
      // return the modified HTML code
      return tempElement.innerHTML;
      
    }
  };
});
