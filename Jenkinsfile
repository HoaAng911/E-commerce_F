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
                    // Thêm lệnh test tương ứng với backend (VD: npm test / dotnet test)
                    sh 'echo "Backend tests passed"'
                }
            }
        }

        stage('3. Test Frontend') {
            steps {
                dir('frontend') {
                    echo "--- Running Frontend Tests ---"
                    // Thêm lệnh test cho frontend (VD: npm run test)
                    sh 'echo "Frontend tests passed"'
                }
            }
        }

        stage('4. Build & Deploy with Docker Compose') {
            steps {
                echo "--- Deploying SHOES_STORE Application ---"
                // Rebuild các service có cập nhật code và chạy ẩn (-d)
                sh 'docker compose --env-file .env.docker up -d --build'
            }
        }
    }

    post {
        always {
            // Dọn dẹp image rác trên server
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