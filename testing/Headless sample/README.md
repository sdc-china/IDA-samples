# Headless Sample

This sample demos how to test Headless BPM with IDA, it include:

1. A sample BPM application
2. Sample Headless Webapp invoke the BPM application
3. Test project for IDA to test the sample Headless webapp

Usage:

1. Update the value of environment variable **BPM_ROOT** in file *docker-compose.yml*
2. Run the docker-compose command to build and start a cantainer for the sample. For example `docker-compose up --build`
3. Access the sample at https://localhost:8443 from web browser