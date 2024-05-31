pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = '1.29.2'
    }

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/yourusername/your-repository.git'
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    // Bring down any existing services
                    sh 'docker-compose down'

                    // Build and run the new services
                    sh 'docker-compose up --build -d'
                }
            }
        }

        stage('Run Migrations and Seed Database') {
            steps {
                script {
                    // Run any necessary database migrations and seeders
                    sh 'docker-compose exec api npm run migrate'
                    sh 'docker-compose exec api npm run seed'
                }
            }
        }
    }

    post {
        always {
            // Cleanup
            sh 'docker-compose down'
        }
    }
}
