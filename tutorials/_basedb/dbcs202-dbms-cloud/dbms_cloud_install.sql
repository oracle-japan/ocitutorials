@$ORACLE_HOME/rdbms/admin/sqlsessstart.sql

set verify off
-- you must not change the owner of the functionality to avoid future issues
define username='C##CLOUD$SERVICE'

create user &username no authentication account lock;

REM Grant Common User Privileges
grant INHERIT PRIVILEGES on user &username to sys;
grant INHERIT PRIVILEGES on user sys to &username;
grant RESOURCE, UNLIMITED TABLESPACE, SELECT_CATALOG_ROLE to &username;
grant CREATE ANY TABLE, DROP ANY TABLE, INSERT ANY TABLE, SELECT ANY TABLE,
CREATE ANY CREDENTIAL, CREATE PUBLIC SYNONYM, CREATE PROCEDURE, ALTER SESSION, CREATE JOB to &username;
grant CREATE SESSION, SET CONTAINER to &username;
grant SELECT on SYS.V_$MYSTAT to &username;
grant SELECT on SYS.SERVICE$ to &username;
grant SELECT on SYS.V_$ENCRYPTION_WALLET to &username;
grant read, write on directory DATA_PUMP_DIR to &username;
grant EXECUTE on SYS.DBMS_PRIV_CAPTURE to &username;
grant EXECUTE on SYS.DBMS_PDB_LIB to &username;
grant EXECUTE on SYS.DBMS_CRYPTO to &username;
grant EXECUTE on SYS.DBMS_SYS_ERROR to &username;
grant EXECUTE ON SYS.DBMS_ISCHED to &username;
grant EXECUTE ON SYS.DBMS_PDB_LIB to &username;
grant EXECUTE on SYS.DBMS_PDB to &username;
grant EXECUTE on SYS.DBMS_SERVICE to &username;
grant EXECUTE on SYS.DBMS_PDB to &username;
grant EXECUTE on SYS.CONFIGURE_DV to &username;
grant EXECUTE on SYS.DBMS_SYS_ERROR to &username;
grant EXECUTE on SYS.DBMS_CREDENTIAL to &username;
grant EXECUTE on SYS.DBMS_RANDOM to &username;
grant EXECUTE on SYS.DBMS_SYS_SQL to &username;
grant EXECUTE on SYS.DBMS_LOCK to &username;
grant EXECUTE on SYS.DBMS_AQADM to &username;
grant EXECUTE on SYS.DBMS_AQ to &username;
grant EXECUTE on SYS.DBMS_SYSTEM to &username;
grant EXECUTE on SYS.SCHED$_LOG_ON_ERRORS_CLASS to &username;
grant SELECT on SYS.DBA_DATA_FILES to &username;
grant SELECT on SYS.DBA_EXTENTS to &username;
grant SELECT on SYS.DBA_CREDENTIALS to &username;
grant SELECT on SYS.AUDIT_UNIFIED_ENABLED_POLICIES to &username;
grant SELECT on SYS.DBA_ROLES to &username;
grant SELECT on SYS.V_$ENCRYPTION_KEYS to &username;
grant SELECT on SYS.DBA_DIRECTORIES to &username;
grant SELECT on SYS.DBA_USERS to &username;
grant SELECT on SYS.DBA_OBJECTS to &username;
grant SELECT on SYS.V_$PDBS to &username;
grant SELECT on SYS.V_$SESSION to &username;
grant SELECT on SYS.GV_$SESSION to &username;
grant SELECT on SYS.DBA_REGISTRY to &username;
grant SELECT on SYS.DBA_DV_STATUS to &username;

alter session set current_schema=&username;
REM Create the Catalog objects
@$ORACLE_HOME/rdbms/admin/dbms_cloud_task_catalog.sql
@$ORACLE_HOME/rdbms/admin/dbms_cloud_task_views.sql
@$ORACLE_HOME/rdbms/admin/dbms_cloud_catalog.sql
@$ORACLE_HOME/rdbms/admin/dbms_cloud_types.sql

REM Create the Package Spec
@$ORACLE_HOME/rdbms/admin/prvt_cloud_core.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_task.plb
@$ORACLE_HOME/rdbms/admin/dbms_cloud_capability.sql
@$ORACLE_HOME/rdbms/admin/prvt_cloud_request.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_internal.plb
@$ORACLE_HOME/rdbms/admin/dbms_cloud.sql
@$ORACLE_HOME/rdbms/admin/prvt_cloud_admin_int.plb

REM Create the Package Body
@$ORACLE_HOME/rdbms/admin/prvt_cloud_core_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_task_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_capability_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_request_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_internal_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_body.plb
@$ORACLE_HOME/rdbms/admin/prvt_cloud_admin_int_body.plb

-- Create the metadata
@$ORACLE_HOME/rdbms/admin/dbms_cloud_metadata.sql

alter session set current_schema=sys;

@$ORACLE_HOME/rdbms/admin/sqlsessend.sql