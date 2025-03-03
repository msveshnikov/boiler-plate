@echo off
setlocal enabledelayedexpansion

set "REMOTE_USER=ubuntu"
set "REMOTE_HOST=AutoResearch.pro"
set "REMOTE_DIR=/home/ubuntu"

echo Starting export of MongoDB collections...

ssh -l %REMOTE_USER% %REMOTE_HOST% "docker exec auto_mongodb_1 mongoexport --db auto --collection users --type=csv --fields=_id,email,firstName,lastName,subscriptionStatus,subscriptionId,createdAt,preferences,lastLogin,emailVerified,isAdmin > users.csv"
ssh -l %REMOTE_USER% %REMOTE_HOST% "docker exec auto_mongodb_1 mongoexport --db auto --collection presentations --type=csv --fields=_id,title,model,userId,slides > presentations.csv"
ssh -l %REMOTE_USER% %REMOTE_HOST% "docker exec auto_mongodb_1 mongoexport --db auto --collection feedbacks --type=csv --fields=userId,type,message,createdAt,updatedAt > feedbacks.csv"

scp %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%/users.csv .
scp %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%/presentations.csv .
scp %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%/feedbacks.csv .

