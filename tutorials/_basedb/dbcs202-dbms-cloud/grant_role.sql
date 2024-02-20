set verify off

-- target sample role
define userrole='CLOUD_USER'

-- target sample user
define username='SCOTT'

create role &userrole;
grant cloud_user to &username;

REM the following are minimal privileges to use DBMS_CLOUD
REM - this script assumes core privileges
REM - CREATE SESSION
REM - Tablespace quote on the default tablespace for a user

REM for creation of external tables, e.g. DBMS_CLOUD.CREATE_EXTERNAL_TABLE()
grant CREATE TABLE to &userrole;

REM for using COPY_DATA()
REM - Any log and bad file information is written into this directory
grant read, write on directory DATA_PUMP_DIR to &userrole;

REM
grant EXECUTE on dbms_cloud to &userrole;