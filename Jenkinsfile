    pipeline {
            agent any

            stages {
                    stage('rollback') {
                            steps {
				    sh 'oc project auto-tasks-dev'
                                    sh 'oc rollback tasks --to-version=1'
                            }
                    }
            }
    }
