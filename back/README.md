# Yoga App !


# Spring Boot Project

## Description
This project is a Spring Boot application using Maven for dependency management and build. It includes unit tests and generates a code coverage report.

## Prerequisites
Before installing and running the project, ensure you have the following tools installed on your machine:

- [JDK 17+](https://adoptium.net/)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [Git](https://git-scm.com/)

## Project Installation

Clone the project from the Git repository:
```sh
git clone https://github.com/kenchi-san/Testez-une-application-full-stack.git
cd /back
```

Install dependencies and compile the project:
```sh
mvn clean install
```

## Running the Project
Start the application with the following command:
```sh
mvn spring-boot:run
```
By default, the application will be accessible at `http://localhost:8080`.

## Running Tests
To execute unit and integration tests:
```sh
mvn test
```

## Generating Code Coverage Report
This project uses JaCoCo to generate a code coverage report.
Run the following command to generate the report:
```sh
mvn jacoco:prepare-agent test jacoco:report
```
The HTML report will be generated in the `target/site/jacoco/index.html` directory.

## Author
- Hugo Charon

