CREATE TABLE locations (
  id_location SERIAL  NOT NULL ,
  name VARCHAR(100)   NOT NULL ,
  position INTEGER   NOT NULL ,
  nation VARCHAR(50)    ,
  state VARCHAR(50)    ,
  city VARCHAR(100)    ,
  description TEXT    ,
  task_status INTEGER  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id_location)  );


CREATE UNIQUE INDEX idx_locations_position ON locations (position);




CREATE TABLE project (
  id_project VARCHAR(50)   NOT NULL ,
  name VARCHAR(50)   NOT NULL ,
  language VARCHAR(5)   NOT NULL ,
  fabula TEXT    ,
  premise TEXT    ,
  setting TEXT    ,
  fabula_task_status INTEGER  DEFAULT 0 NOT NULL ,
  premise_task_status INTEGER  DEFAULT 0 NOT NULL ,
  setting_task_status INTEGER  DEFAULT 0 NOT NULL ,
  strand_task_status INTEGER  DEFAULT 0 NOT NULL ,
  bibisco_version VARCHAR(20)   NOT NULL   ,
PRIMARY KEY(id_project));




CREATE TABLE strands (
  id_strand SERIAL  NOT NULL ,
  name VARCHAR(50)   NOT NULL ,
  position INTEGER   NOT NULL ,
  description TEXT    ,
  task_status INTEGER  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id_strand)  );


CREATE UNIQUE INDEX idx_strands_position ON strands (position);




CREATE TABLE images (
  id_image SERIAL  NOT NULL ,
  description VARCHAR(50)   NOT NULL ,
  id_element INTEGER   NOT NULL ,
  element_type INTEGER   NOT NULL ,
  file_name VARCHAR(50)   NOT NULL   ,
PRIMARY KEY(id_image));





CREATE TABLE characters (
  id_character SERIAL  NOT NULL ,
  main_character CHAR(1)   NOT NULL ,
  name VARCHAR(100)   NOT NULL ,
  position INTEGER   NOT NULL ,
  personal_data_task_status INTEGER  DEFAULT 0 NOT NULL ,
  personal_data_free_text TEXT    ,
  personal_data_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  physionomy_task_status INTEGER  DEFAULT 0 NOT NULL ,
  physionomy_free_text TEXT    ,
  physionomy_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  psychology_task_status INTEGER  DEFAULT 0 NOT NULL ,
  psychology_free_text TEXT    ,
  psychology_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  behaviors_task_status INTEGER  DEFAULT 0 NOT NULL ,
  behaviors_free_text TEXT    ,
  behaviors_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  sociology_task_status INTEGER  DEFAULT 0 NOT NULL ,
  sociology_free_text TEXT    ,
  sociology_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  ideas_task_status INTEGER  DEFAULT 0 NOT NULL ,
  ideas_free_text TEXT    ,
  ideas_interview CHAR(1)  DEFAULT 'Y' NOT NULL ,
  lifebeforestorybeginning_task_status INTEGER  DEFAULT 0 NOT NULL ,
  lifebeforestorybeginning TEXT    ,
  conflict_task_status INTEGER  DEFAULT 0 NOT NULL ,
  conflict TEXT    ,
  evolutionduringthestory_task_status INTEGER  DEFAULT 0 NOT NULL ,
  evolutionduringthestory TEXT    ,
  secondary_character_description TEXT    ,
  secondary_character_description_task_status INTEGER  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id_character)  );


CREATE UNIQUE INDEX idx_characters_position_main_character ON characters (main_character, position);




CREATE TABLE chapters (
  id_chapter SERIAL  NOT NULL ,
  title VARCHAR(50)    ,
  position INTEGER   NOT NULL ,
  reason TEXT    ,
  reason_task_status INTEGER  DEFAULT 0 NOT NULL ,
  note TEXT      ,
PRIMARY KEY(id_chapter)  );


CREATE UNIQUE INDEX idx_chapters_position ON chapters (position);




CREATE TABLE scenes (
  id_scene SERIAL  NOT NULL ,
  id_chapter INTEGER   NOT NULL ,
  description VARCHAR(50)   NOT NULL ,
  position INTEGER   NOT NULL ,
  task_status INTEGER  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id_scene)    ,
  FOREIGN KEY(id_chapter)
    REFERENCES chapters(id_chapter));


CREATE INDEX scenes_FKIndex1 ON scenes (id_chapter);
CREATE UNIQUE INDEX idx_scenes_id_chapter_position ON scenes (id_chapter, position);


CREATE INDEX IFK_fk_chapters_scns ON scenes (id_chapter);


CREATE TABLE character_infos (
  id_character INTEGER   NOT NULL ,
  question INTEGER   NOT NULL ,
  character_info_type VARCHAR(30)   NOT NULL ,
  info TEXT      ,
PRIMARY KEY(id_character, question, character_info_type)  ,
  FOREIGN KEY(id_character)
    REFERENCES characters(id_character));


CREATE INDEX character_infos_FKIndex1 ON character_infos (id_character);


CREATE INDEX IFK_fk_characters_character_in ON character_infos (id_character);


CREATE TABLE scene_revisions (
  id_scene_revision SERIAL  NOT NULL ,
  id_location INTEGER    ,
  id_scene INTEGER   NOT NULL ,
  point_of_view_id_character INTEGER    ,
  revision_number INTEGER   NOT NULL ,
  scene TEXT    ,
  scene_date TIMESTAMP    ,
  selected CHAR(1)   NOT NULL ,
  point_of_view INTEGER    ,
  tense VARCHAR(20)    ,
  words INTEGER  DEFAULT 0 NOT NULL ,
  characters INTEGER  DEFAULT 0 NOT NULL   ,
PRIMARY KEY(id_scene_revision)        ,
  FOREIGN KEY(id_scene)
    REFERENCES scenes(id_scene),
  FOREIGN KEY(point_of_view_id_character)
    REFERENCES characters(id_character),
  FOREIGN KEY(id_location)
    REFERENCES locations(id_location));


CREATE INDEX scene_revisions_FKIndex1 ON scene_revisions (id_scene);
CREATE INDEX scene_revisions_FKIndex3 ON scene_revisions (point_of_view_id_character);
CREATE INDEX scene_revisions_FKIndex5 ON scene_revisions (id_location);
CREATE UNIQUE INDEX idx_scene_revisions_id_scene_rev_number ON scene_revisions (id_scene, revision_number);


CREATE INDEX IFK_fk_scn_scn_revs ON scene_revisions (id_scene);
CREATE INDEX IFK_fk_chrs_scn_revs ON scene_revisions (point_of_view_id_character);
CREATE INDEX IFK_fk_locations_scn_revs ON scene_revisions (id_location);


CREATE TABLE scene_revision_strands (
  id_strand INTEGER   NOT NULL ,
  id_scene_revision INTEGER   NOT NULL   ,
PRIMARY KEY(id_strand, id_scene_revision)    ,
  FOREIGN KEY(id_strand)
    REFERENCES strands(id_strand),
  FOREIGN KEY(id_scene_revision)
    REFERENCES scene_revisions(id_scene_revision));


CREATE INDEX strand_scene_revision_FKIndex1 ON scene_revision_strands (id_strand);
CREATE INDEX strand_scene_revision_FKIndex2 ON scene_revision_strands (id_scene_revision);


CREATE INDEX IFK_fk_strand_strand_scene_rev ON scene_revision_strands (id_strand);
CREATE INDEX IFK_fk_scene_rev_strand_scene_ ON scene_revision_strands (id_scene_revision);


CREATE TABLE scene_revision_characters (
  id_character INTEGER   NOT NULL ,
  id_scene_revision INTEGER   NOT NULL   ,
PRIMARY KEY(id_character, id_scene_revision)    ,
  FOREIGN KEY(id_scene_revision)
    REFERENCES scene_revisions(id_scene_revision),
  FOREIGN KEY(id_character)
    REFERENCES characters(id_character));


CREATE INDEX scene_characters_FKIndex1 ON scene_revision_characters (id_scene_revision);
CREATE INDEX scene_characters_FKIndex2 ON scene_revision_characters (id_character);


CREATE INDEX IFK_fk_scn_revs_scn_revs_chrs ON scene_revision_characters (id_scene_revision);
CREATE INDEX IFK_fk_chrs_scn_revs_chrs ON scene_revision_characters (id_character);



