@echo off
setlocal
title Performance Test Runner

echo Performance Test Runner

if exist "checkEnv.bat" goto check_env
goto check_java

:check_env
call "checkEnv.bat"

:check_java
if exist "%JAVA_HOME%\bin\java.exe" goto check_gatling
goto end

:check_gatling
if exist "%GATLING_HOME%\bin\gatling.bat" goto performance_runner
goto end

:performance_runner
"%GATLING_HOME%\bin\gatling.bat" -sf simulations -rsf resources -bf target/test-classes -rf results -s %*
:end
endlocal
pause