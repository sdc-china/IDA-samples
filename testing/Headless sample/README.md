# Headless Sample

This sample demos how to test Headless BPM with IDA, it include:

1. A sample BPM application
2. Sample Headless Webapp invoke the BPM application
3. Test project for IDA to test the sample Headless webapp

## Prepare

1. Create 3 sample users(david, bob and jane) with password 123456
2. Import the *Testing Sample* twx
3. Add the sample users to corresponding teams and remove tw_allusers from the User Groups in the *Testing Sample* application
   + HiringManagers: david
   + GeneralManagers: bob
   + Human Resources: jane

## Usage

1. Update the value of environment variable **BPM_ROOT** in file *docker-compose.yml*
2. Run the docker-compose command to build and start a cantainer for the sample. For example `docker-compose up --build`
3. Access the sample at https://localhost:8443 from web browser