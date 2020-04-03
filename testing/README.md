## Samples for Testing

### Projects

    1. IDA Sample - IDA Sample
    2. UI command sample for BP3 toolkit - BP3 Sample
    3. Headless sample - Headless Sample
    4. BPMoC sample - BPMoC Sample

### Resources

    - TWX - IDA Sample App.twx

## Installation and Getting Started

    1. Import the {TWX}/(Sample_TWX_file).twx file to IBM IBM Process Center.
    2. Zip the Sample project folder to a zip format file like Sample_Project.zip
    3. After importing the Sample_Project.zip to IDA Web, you could run the built in test cases.

## Headless Sample

This sample demos how to test Headless BPM with IDA, it include:

    1. Sample Headless Webapp invoke the BPM application
    2. Exported testing project for IDA to test the sample Headless webapp

### Configure BPM

    1. Create 3 sample users(david, bob and jane) with password 123456 in your BPM Process Center
    2. Import the *Testing Sample* twx into your BPM Process Center
    3. Add the sample users to corresponding teams and remove tw_allusers from the User Groups in the *Testing Sample* application
       - HiringManagers: david
       - GeneralManagers: bob
       - Human Resources: jane

### Configure the Headless Sample application

    1. Update the value of environment variable **BPM_ROOT** in file *docker-compose.yml* to point to your Process Center
    2. Install Docker and Docker-compose on your server that will run the Headless Sample application. **Note**: *the sample app is a pure html/javascript page, you can also run it on any server instead of Docker*
    3. Run the docker-compose command to build and start a cantainer for the sample. For example `docker-compose up --build`
    4. Access the sample at *https://<your_server>:8443* from web browser to verify the sample app is working

### Run the IDA to test against the Headless Sample application

    1. Import the test project *Headless Sample.zip* under *test* folder into IDA
    2. Make sure the value for **Server** and **Process App** are correct in your environment
    3. Update the value of **URL** for first step in each test cases to correct URL that point to your headless sample(i.e. *https://<your_server>:8443* in previous section)
    4. Run the test cases from the **Headless Sample** test project from IDA
