CREATE TABLE properties (
  property VARCHAR(50)   NOT NULL ,
  value VARCHAR(500)   NOT NULL   ,
PRIMARY KEY(property));




CREATE TABLE projects (
  id_project VARCHAR(50)   NOT NULL ,
  name VARCHAR(50)   NOT NULL   ,
PRIMARY KEY(id_project));




CREATE TABLE messages (
  id_message INTEGER   NOT NULL ,
  number_of_views INTEGER   NOT NULL   ,
PRIMARY KEY(id_message));





