node {
    stage('rollback') {
	    sh 'oc project auto-tasks-dev'
        sh 'oc rollback tasks --to-version=1'
	  }
}
