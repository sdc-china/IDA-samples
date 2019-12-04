echo Check the environment setting, please setup JAVA_HOME and GATLING_HOME

:check_java
if exist "%JAVA_HOME%\bin\java.exe" goto java_found

set "JAVA_HOME=C:/caiwen/jdk1.8.0_121"
set "PATH=%PATH%;%JAVA_HOME%\bin"

if exist "%JAVA_HOME%\bin\java.exe" goto java_found
echo WARN: java.exe was not found in %JAVA_HOME%\bin. Please specify a correct JAVA_HOME.

goto end

:java_found
echo INFO: The JAVA_HOME %JAVA_HOME% will be used.
goto check_gatling

:check_gatling
if exist "%GATLING_HOME%\bin\gatling.bat" goto gatling_found

set "GATLING_HOME=C:/caiwen/gatling-charts-highcharts-bundle-3.3.1-bundle"

if exist "%GATLING_HOME%\bin\gatling.bat" goto gatling_found

echo WARN: %GATLING_HOME% was not correct. Please specify a correct GATLING_HOME
goto end

:gatling_found
echo INFO: The GATLING_HOME %GATLING_HOME% will be used.

:end
