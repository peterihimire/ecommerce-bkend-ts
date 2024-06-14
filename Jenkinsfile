pipeline {
    agent any

    environment {
      DOCKER_REGISTRY = 'docker.io'
      DOCKER_COMPOSE_VERSION = '2.27.0'
      DOCKER_HUB_CREDENTIALS = '954e61ad-1f15-4314-a185-bdc08f5f00bb' //Using [withDockerRegistry] Name of Docker Hub credentials in Jenkins
    }

    parameters {
      booleanParam(name: 'UNDO_MIGRATIONS', defaultValue: false, description: 'Undo migrations')
      booleanParam(name: 'RUN_SEED', defaultValue: false, description: 'Run seed data')
      booleanParam(name: 'RUN_MIGRATIONS', defaultValue: false, description: 'Run migrations')
    }

    stages {
  
      stage('Clone repository') {
        steps {
            git branch: 'jenkins', url: 'https://github.com/peterihimire/ecommerce-bkend-ts.git'
        }
      }

      stage('Load Environment Variables') {
        steps {
          script {
            // Ensure .env file is copied to the workspace if not already there
            sh 'cp /root/.env ${WORKSPACE}/.env'
            
            // Load environment variables from the copied .env file
            sh 'set -o allexport; . ${WORKSPACE}/.env; set +o allexport'
          }
        }
      }

      stage('Build and Deploy') {
        steps {
          script {
              
            // Bring down any existing services
            sh '/usr/bin/docker compose down'

            // Build and run the new services
              withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS) {
              sh '/usr/bin/docker compose up --build -d'
              // sh '/usr/bin/docker compose up -d'
            }
          }
        }
      }

      stage('Undo Migrations') {
        when {
          expression { return params.UNDO_MIGRATIONS }
        }
        steps {
          script {
            withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS) {
              sh '/usr/bin/docker compose exec api npm run undo_migr'
            }
          }
        }
      }

      stage('Run Seed') {
        when {
          expression { return params.RUN_SEED }
        }
        steps {
          script {
            sh '/usr/bin/docker compose exec api npm run seed'
          }
        }
      }

      stage('Run Migrations') {
        when {
            expression { return params.RUN_MIGRATIONS }
        }
        steps {
          script {
            withDockerRegistry(credentialsId: DOCKER_HUB_CREDENTIALS) {
              sh '/usr/bin/docker compose exec api npm run migr'
            }
          }
        }
      }
    }
}
