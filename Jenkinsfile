pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_COMPOSE_VERSION = '1.29.2'
        DOCKER_HUB_CREDENTIALS = 'f3b65def-ff2b-4c13-900d-4c7f9dde7bfe' // Name of Docker Hub credentials in Jenkins
    }

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/peterihimire/ecommerce-bkend-ts.git'
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    // Bring down any existing services
                    sh '/usr/bin/docker compose down'

                    // Build and run the new services
                     withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS, variable: 'DOCKER_HUB_CREDENTIALS') {
                        sh '/usr/bin/docker compose up --build -d'
                    }
                }
            }
        }

        stage('Run Seed') {
            steps {
                script {
                     withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS, variable: 'DOCKER_HUB_CREDENTIALS') {
                        sh '/usr/bin/docker compose exec api npm run seed'
                    }
                }
            }
        }

        stage('Run Migrations') {
            steps {
                script {
                    // Run migrations if necessary
                    // For example, you can use a boolean parameter to trigger migrations
                    if (params.RUN_MIGRATIONS == 'true') {
                         withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS, variable: 'DOCKER_HUB_CREDENTIALS') {
                            sh '/usr/bin/docker compose exec api npm run migr'
                        }
                    }
                }
            }
        }
    }

}
