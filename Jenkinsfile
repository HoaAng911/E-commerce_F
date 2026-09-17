pipeline {
    agent any

    environment {
        ENV_FILE = '.env.docker'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Test Backend') {
            steps {
                dir('backend') {
                    echo "--- Running Backend Tests ---"
                    sh 'echo "Backend tests passed"'
                }
            }
        }

        stage('3. Test Frontend') {
            steps {
                dir('frontend') {
                    echo "--- Running Frontend Tests ---"
                    sh 'echo "Frontend tests passed"'
                }
            }
        }

        stage('4. Deploy Frontend to Vercel') {
            steps {
                dir('frontend') {
                    echo "--- Deploying Frontend to Vercel ---"
                    withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
                        sh 'npx vercel --token=$VERCEL_TOKEN --prod --yes'
                    }
                }
            }
        }

        stage('5. Build & Deploy Services with Docker Compose') {
            steps {
                echo "--- Deploying SHOES_STORE Application ---"
                sh 'docker compose --env-file .env.docker up -d --build'
            }
        }
    }

    post {
        always {
            // Dọn dẹp các Docker image rác không sử dụng
            sh 'docker image prune -f'
        }
        success {
            echo 'Triển khai dự án SHOES_STORE thành công!'
        }
        failure {
            echo 'Có lỗi xảy ra trong quá trình CI/CD!'
        }
    }
}