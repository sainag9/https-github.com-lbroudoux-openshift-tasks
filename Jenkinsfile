// Run this node on a Maven Slave edit
	// Maven Slaves have JDK and Maven already installed
	node('maven') {
	  // Make sure your nexus_openshift_settings.xml
	  // Is pointing to your nexus instance
	  def mvnCmd = "mvn"
	
	  stage('Checkout Source') {
	    // Get Source Code from SCM (Git) as configured in the Jenkins Project
	    // Next line for inline script, "checkout scm" for Jenkinsfile from Gogs
	    //git 'http://gogs.xyz-gogs.svc.cluster.local:3000/CICDLabs/openshift-tasks.git'
	    checkout scm
	  }
			
  
	  // The following variables need to be defined at the top level and not inside
	  // the scope of a stage - otherwise they would not be accessible from other stages.
	  // Extract version and other properties from the pom.xml
	  def groupId    = getGroupIdFromPom("pom.xml")
	  def artifactId = getArtifactIdFromPom("pom.xml")
	  def version    = getVersionFromPom("pom.xml")
	
	  stage('Build war') {
	    echo "Building version ${version}"
	
	    sh "${mvnCmd} clean package -DskipTests"
	  }
	 

	
	  stage('Build OpenShift Image') {
	    def newTag = "TestingCandidate-${version}"
	    echo "New Tag: ${newTag}"
	
	    // Copy the war file we just built and rename to ROOT.war
	    sh "cp ./target/tasks-ui.war ./ROOT.war"
	
	    // Start Binary Build in OpenShift using the file we just published
	    // Replace xyz-tasks-dev2 with the name of your dev project
	    sh "oc project xyz-tasks-dev2"
	    sh "oc start-build tasks --follow --from-file=./ROOT.war -n xyz-tasks-dev2"
	
	    openshiftTag alias: 'false', destStream: 'tasks', destTag: newTag, destinationNamespace: 'xyz-tasks-dev2', namespace: 'xyz-tasks-dev2', srcStream: 'tasks', srcTag: 'latest', verbose: 'false'
	  }
	
	  stage('Deploy to Dev') {
	    // Patch the DeploymentConfig so that it points to the latest TestingCandidate-${version} Image.
	    // Replace xyz-tasks-dev2 with the name of your dev project
	    sh "oc project xyz-tasks-dev2"
	    sh "oc patch dc tasks --patch '{\"spec\": { \"triggers\": [ { \"type\": \"ImageChange\", \"imageChangeParams\": { \"containerNames\": [ \"tasks\" ], \"from\": { \"kind\": \"ImageStreamTag\", \"namespace\": \"xyz-tasks-dev2\", \"name\": \"tasks:TestingCandidate-$version\"}}}]}}' -n xyz-tasks-dev2"
	
	    openshiftDeploy depCfg: 'tasks', namespace: 'xyz-tasks-dev2', verbose: 'false', waitTime: '', waitUnit: 'sec'
	    openshiftVerifyDeployment depCfg: 'tasks', namespace: 'xyz-tasks-dev2', replicaCount: '1', verbose: 'false', verifyReplicaCount: 'false', waitTime: '', waitUnit: 'sec'
	    openshiftVerifyService namespace: 'xyz-tasks-dev2', svcName: 'tasks', verbose: 'false'
	  }
	
	  
	}
	
	// Convenience Functions to read variables from the pom.xml
	def getVersionFromPom(pom) {
	  def matcher = readFile(pom) =~ '<version>(.+)</version>'
	  matcher ? matcher[0][1] : null
	}
	def getGroupIdFromPom(pom) {
	  def matcher = readFile(pom) =~ '<groupId>(.+)</groupId>'
	  matcher ? matcher[0][1] : null
	}
	def getArtifactIdFromPom(pom) {
	  def matcher = readFile(pom) =~ '<artifactId>(.+)</artifactId>'
	  matcher ? matcher[0][1] : null
}
