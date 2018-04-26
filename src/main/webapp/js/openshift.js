var mainApp = angular.module("mainApp", []);

mainApp
		.controller(
				'controller',
				function($scope, $http) {
					$scope.home = function() {
						$scope.deployflag = false;
						$scope.rollbackflag = false;
					}
					$scope.deployfn = function() {
						document.getElementById("formreset").reset();
						$scope.deployflag = true;
						$scope.rollbackflag = false;
					}
					$scope.rollbackfn = function() {
						document.getElementById("formreset").reset();
						$scope.deployflag = false;
						$scope.rollbackflag = true;
					}
					$(function() {
						$("#sortable1, #sortable2").sortable({
							connectWith : ".connectedSortable"
						}).disableSelection();
					});

					$scope.submitForm = function() {
						if ($scope.rollbackflag) {
							var blob_file = $scope.rollback;
						} else if ($scope.emailadd) {
							var blob_file = $scope.jenkinsfilePreview
									+ $scope.terminaljenkins;
						} else {
							var blob_file = $scope.jenkinsfilePreview
									+ $scope.finalJenkins;
							alert(blob_file)
						}
						if (blob_file) {
							var a = document.createElement("a");
							document.body.appendChild(a);
							a.style = "display: none";
							var blob = new Blob([ blob_file ], {
								type : 'application/octet-stream'
							}), url1 = window.URL.createObjectURL(blob);
							a.href = url1;
							a.download = 'Jenkinsfile';
							a.click();
							window.URL.revokeObjectURL(url1);
						}

						
							var blob1 = new Blob([ $scope.yamlfile ], {
								type : 'octet-stream'
							});
							var blob2 = new Blob([ $scope.sonarqubeyaml ], {
								type : 'octet-stream'
							});
							var blob3 = new Blob(
									[ $scope.sonarqubepostgresql ], {
										type : 'octet-stream'
									});

							var zip = new JSZip();
							zip.file("yamlfile.yaml", blob1);
							zip.file("sonarqube.yaml", blob2);
							zip.file("sonarqubepostgresql.yaml", blob3);
							zip.generateAsync({
								type : "blob"
							}).then(function(content) {
								// see FileSaver.js
								saveAs(content, "yamlfiles.zip");
							});
						

					}
					$scope.preview = function() {
						var $sortableList = $("#sortable2");
						var optionTexts = [];
						$("#sortable2 li").each(function() {
							optionTexts.push($(this).text())
						});
						$scope.warningflag = false;
						if ($scope.github && $scope.oproject && $scope.gproject) {
							var email_id = 'def notifySuccessful() {\n  emailext (\n      subject: \"SUCCESSFUL: Job \'${env.JOB_NAME} [${env.BUILD_NUMBER}]\'\",\n      body: \"\"\"<p>SUCCESSFUL: Job \'${env.JOB_NAME} [${env.BUILD_NUMBER}]\':<\/p>\n        <p>Check console output at \"<a href=\"${env.BUILD_URL}\">${env.JOB_NAME} [${env.BUILD_NUMBER}]<\/a>\"<\/p>\"\"\",\n      recipientProviders: [[$class: \'RequesterRecipientProvider\']],to:\'mail_id\'\n    )\n}';
							if ($scope.emailadd) {
								$scope.mail_id = email_id.replace(/mail_id/g,
										$scope.emailadd);
							}
							document.getElementById("jpreview").style.color = "black";
							var str = 'apiVersion: v1\nkind: Template\nlabels:\n  template: openshift_application_name\nmetadata:\n  name: openshift_application_name\nobjects:\n- apiVersion: v1\n  kind: BuildConfig\n  metadata:\n    annotations:\n      pipeline.alpha.openshift.io\/uses: \'[{\"name\": \"openshift_application_name\", \"namespace\": \"\", \"kind\": \"DeploymentConfig\"}]\'\n    labels:\n      application: ${APPLICATION_NAME}\n    name: ${APPLICATION_NAME}\n  spec:\n    source:\n      git:\n        ref: ${SOURCE_REF}\n        uri: ${SOURCE_URL}\n      type: Git\n    strategy:\n      jenkinsPipelineStrategy:\n        jenkinsfilePath: Jenkinsfile\n      type: JenkinsPipeline\n      type: Generic\n    triggers:\n    - github:\n        secret: github_secret\n      type: GitHub\n    - generic:\n        secret: github_secret\n      type: Generic\nparameters:\n- description: The name for the application.\n  name: APPLICATION_NAME\n  required: true\n  value: openshift_application_name\n- description: The name of Dev project\n  name: DEV_PROJECT\n  required: true\n  value: openshift_project_name\n- description: Git source URI for application\n  name: SOURCE_URL\n  required: true\n  value: github_project_name\n- description: Git branch\/tag reference\n  name: SOURCE_REF\n  value: master';
							$scope.modalHeader = "Jenkinsfile Preview";
							document.getElementById("mHeader").style.color = "green";
							var str1 = str.replace(/openshift_project_name/g,
									$scope.oproject);
							var str2 = str1.replace(
									/openshift_application_name/g,
									$scope.gproject);
							var str3 = str2.replace(/github_project_name/g,
									$scope.github);
							$scope.yamlfile = str3.replace(/github_secret/g,
									$scope.gsecret);
							$scope.defaultJenkins = '\/\/ Run this node on a Maven Slave edit\n\t\/\/ Maven Slaves have JDK and Maven already installed\n\tnode(\'maven\') {\n\t  \/\/ Make sure your nexus_openshift_settings.xml\n\t  \/\/ Is pointing to your nexus instance\n\t  def mvnCmd = \"mvn\"\n\t\n\t  stage(\'Checkout Source\') {\n\t    \/\/ Get Source Code from SCM (Git) as configured in the Jenkins Project\n\t    \/\/ Next line for inline script, \"checkout scm\" for Jenkinsfile from Gogs\n\t    \/\/git \'http:\/\/gogs.xyz-gogs.svc.cluster.local:3000\/CICDLabs\/openshift-tasks.git\'\n\t    checkout scm\n\t  }\n\t\t\t\n  \n\t  \/\/ The following variables need to be defined at the top level and not inside\n\t  \/\/ the scope of a stage - otherwise they would not be accessible from other stages.\n\t  \/\/ Extract version and other properties from the pom.xml\n\t  def groupId    = getGroupIdFromPom(\"pom.xml\")\n\t  def artifactId = getArtifactIdFromPom(\"pom.xml\")\n\t  def version    = getVersionFromPom(\"pom.xml\")\n\t\n\t  stage(\'Build war\') {\n\t    echo \"Building version ${version}\"\n\t\n\t    sh \"${mvnCmd} clean package -DskipTests\"\n\t  }';
							$scope.unittests = 'stage(\'Unit Tests\') {\n\t    echo \"Unit Tests\"\n\t    sh \"${mvnCmd} test\"\n\t  }';
							$scope.sonarqube = 'stage(\'Code Analysis\') {\n            echo \"Code Analysis\"\n\n          \/\/ Replace xyz-sonarqube with the name of your project\n           sh \"${mvnCmd} org.sonarsource.scanner.maven:sonar-maven-plugin:3.4.0.905:sonar -Dsonar.host.url=http:\/\/sonarqube-xyz-jenkins.apps.rhosp.com\/ -Dsonar.projectName=${JOB_BASE_NAME}\"\n\t\t   }';
							$scope.jira = 'node {\n  stage(\'JIRA\') {\n    \/\/ Look at IssueInput class for more information.\n  jiraComment body: \'test case executed successfully\', issueKey: \'10000\'\n \n  }\n}';
							$scope.buildimage = 'stage(\'Build OpenShift Image\') {\n\t    def newTag = \"TestingCandidate-${version}\"\n\t    echo \"New Tag: ${newTag}\"\n\t\n\t    \/\/ Copy the war file we just built and rename to ROOT.war\n\t    sh \"cp .\/target\/tasks-ui.war .\/ROOT.war\"\n\t\n\t    \/\/ Start Binary Build in OpenShift using the file we just published\n\t    \/\/ Replace xyz-tasks-dev1 with the name of your dev project\n\t    sh \"oc project xyz-tasks-dev1\"\n\t    sh \"oc start-build tasks --follow --from-file=.\/ROOT.war -n xyz-tasks-dev1\"\n\t\n\t    openshiftTag alias: \'false\', destStream: \'tasks\', destTag: newTag, destinationNamespace: \'xyz-tasks-dev1\', namespace: \'xyz-tasks-dev1\', srcStream: \'tasks\', srcTag: \'latest\', verbose: \'false\'\n\t  }';
							$scope.devJenkins = 'stage(\'Deploy to Dev\') {\n\t    \/\/ Patch the DeploymentConfig so that it points to the latest TestingCandidate-${version} Image.\n\t    \/\/ Replace xyz-tasks-dev1 with the name of your dev project\n\t    sh \"oc project xyz-tasks-dev1\"\n\t    sh \"oc patch dc tasks --patch \'{\\\"spec\\\": { \\\"triggers\\\": [ { \\\"type\\\": \\\"ImageChange\\\", \\\"imageChangeParams\\\": { \\\"containerNames\\\": [ \\\"tasks\\\" ], \\\"from\\\": { \\\"kind\\\": \\\"ImageStreamTag\\\", \\\"namespace\\\": \\\"xyz-tasks-dev1\\\", \\\"name\\\": \\\"tasks:TestingCandidate-$version\\\"}}}]}}\' -n xyz-tasks-dev1\"\n\t\n\t    openshiftDeploy depCfg: \'tasks\', namespace: \'xyz-tasks-dev1\', verbose: \'false\', waitTime: \'\', waitUnit: \'sec\'\n\t    openshiftVerifyDeployment depCfg: \'tasks\', namespace: \'xyz-tasks-dev1\', replicaCount: \'1\', verbose: \'false\', verifyReplicaCount: \'false\', waitTime: \'\', waitUnit: \'sec\'\n\t    \/\/openshiftVerifyService namespace: \'xyz-tasks-dev1\', svcName: \'tasks\', verbose: \'false\'\n\t  }';
							$scope.integrationtests = 'stage(\'Integration Test\') {\n\t    \/\/ TBD: Proper test\n\t    \/\/ Could use the OpenShift-Tasks REST APIs to make sure it is working as expected.\n\t\n\t    def newTag = \"ProdReady-${version}\"\n\t    echo \"New Tag: ${newTag}\"\n\t\n\t    \/\/ Replace xyz-tasks-dev1 with the name of your dev project\n\t    openshiftTag alias: \'false\', destStream: \'tasks\', destTag: newTag, destinationNamespace: \'xyz-tasks-dev1\', namespace: \'xyz-tasks-dev1\', srcStream: \'tasks\', srcTag: \'latest\', verbose: \'false\'\n\t  }';
							$scope.prodJenkins = '\/\/ Blue\/Green Deployment into Production\n\t  \/\/ -------------------------------------\n\t  def dest   = \"tasks-green\"\n\t  def active = \"\"\n\t\n\t  stage(\'Prep Production Deployment\') {\n\t    \/\/ Replace xyz-tasks-dev1 and xyz-tasks-prod1 with\n\t    \/\/ your project names\n\t    sh \"oc project xyz-tasks-prod1\"\n\t    sh \"oc get route tasks -n xyz-tasks-prod1 -o jsonpath=\'{ .spec.to.name }\' > activesvc.txt\"\n\t    active = readFile(\'activesvc.txt\').trim()\n\t    if (active == \"tasks-green\") {\n\t      dest = \"tasks-blue\"\n\t    }\n\t    echo \"Active svc: \" + active\n\t    echo \"Dest svc:   \" + dest\n\t  }\n\t  stage(\'Deploy new Version\') {\n\t    echo \"Deploying to ${dest}\"\n\t\n\t    \/\/ Patch the DeploymentConfig so that it points to\n\t    \/\/ the latest ProdReady-${version} Image.\n\t    \/\/ Replace xyz-tasks-dev1 and xyz-tasks-prod1 with\n\t    \/\/ your project names.\n\t    sh \"oc patch dc ${dest} --patch \'{\\\"spec\\\": { \\\"triggers\\\": [ { \\\"type\\\": \\\"ImageChange\\\", \\\"imageChangeParams\\\": { \\\"containerNames\\\": [ \\\"$dest\\\" ], \\\"from\\\": { \\\"kind\\\": \\\"ImageStreamTag\\\", \\\"namespace\\\": \\\"xyz-tasks-dev1\\\", \\\"name\\\": \\\"tasks:ProdReady-$version\\\"}}}]}}\' -n xyz-tasks-prod1\"\n\t\n\t    openshiftDeploy depCfg: dest, namespace: \'xyz-tasks-prod1\', verbose: \'false\', waitTime: \'\', waitUnit: \'sec\'\n\t    openshiftVerifyDeployment depCfg: dest, namespace: \'xyz-tasks-prod1\', replicaCount: \'1\', verbose: \'false\', verifyReplicaCount: \'true\', waitTime: \'\', waitUnit: \'sec\'\n\t    \/\/openshiftVerifyService namespace: \'xyz-tasks-prod1\', svcName: dest, verbose: \'false\'\n\t  }\n\t  stage(\'Switch over to new Version\') {\n\t    input \"Switch Production?\"\n\t\n\t    \/\/ Replace xyz-tasks-prod1 with the name of your\n\t    \/\/ production project\n\t    sh \'oc patch route tasks -n xyz-tasks-prod1 -p \\\'{\"spec\":{\"to\":{\"name\":\"\' + dest + \'\"}}}\\\'\'\n\t    sh \'oc get route tasks -n xyz-tasks-prod1 > oc_out.txt\'\n\t    oc_out = readFile(\'oc_out.txt\')\n\t    echo \"Current route configuration: \" + oc_out\n\t  }';
							$scope.finalJenkins = '}\n\t\n\t\/\/ Convenience Functions to read variables from the pom.xml\n\tdef getVersionFromPom(pom) {\n\t  def matcher = readFile(pom) =~ \'<version>(.+)<\/version>\'\n\t  matcher ? matcher[0][1] : null\n\t}\n\tdef getGroupIdFromPom(pom) {\n\t  def matcher = readFile(pom) =~ \'<groupId>(.+)<\/groupId>\'\n\t  matcher ? matcher[0][1] : null\n\t}\n\tdef getArtifactIdFromPom(pom) {\n\t  def matcher = readFile(pom) =~ \'<artifactId>(.+)<\/artifactId>\'\n\t  matcher ? matcher[0][1] : null\n}';
							$scope.jenkinsfilePreview = $scope.defaultJenkins;
							var jsobj = {
								jira : $scope.jira,
								sonar : $scope.sonarqube,
								Integration_Testing : $scope.integrationtests,
								junit : $scope.unittests,
								dev : $scope.devJenkins,
								prod : $scope.prodJenkins, 
								Additional_Scripts : $scope.textareascript,
								buildimage : $scope.buildimage,
							}
							$
									.each(
											optionTexts,
											function(index, value) {
												$scope.jenkinsfilePreview = $scope.jenkinsfilePreview
														+ '\n' + jsobj[value];
											});
							if ($scope.emailadd) {
								$scope.notify_successful = 'def notifySuccessful() {\n  emailext (\n      subject: \"SUCCESSFUL: Job \'${env.JOB_NAME} [${env.BUILD_NUMBER}]\'\",\n      body: \"\"\"<p>SUCCESSFUL: Job \'${env.JOB_NAME} [${env.BUILD_NUMBER}]\':<\/p>\n        <p>Check console output at \"<a href=\"${env.BUILD_URL}\">${env.JOB_NAME} [${env.BUILD_NUMBER}]<\/a>\"<\/p>\"\"\",\n      recipientProviders: [[$class: \'RequesterRecipientProvider\']],to:\'replace_email\'\n    )\n}';
								var maill = $scope.notify_successful.replace(
										/replace_email/g, $scope.emailadd);
								$scope.terminaljenkins = $scope.finalJenkins
										+ '\n' + maill;
							}
						} else if ($scope.Dprojectname && $scope.Dconfigname
								&& $scope.Dversion) {
							var rb = 'node {\n    stage(\'rollback\') {\n\tsh \'oc project dep_project\'\n        sh \'oc rollback dep_config --to-version=version_number\'\n    }\n}';
							var rb1 = rb.replace(/dep_project/g,
									$scope.Dprojectname);
							var rb2 = rb1.replace(/dep_config/g,
									$scope.Dconfigname);
							$scope.rollback = rb2.replace(/version_number/g,
									$scope.Dversion);
							$scope.modalHeader = "Rollback Preview";
							$scope.rollbackflag = true;
							$scope.jenkinsfilePreview = $scope.rollback;
						} else {
							$scope.modalHeader = "Warning Message";
							$scope.warningflag = true;
							$scope.jenkinsfilePreview = "please select all mandatory fields";
							document.getElementById("jpreview").style.color = "red";
						}

					}
					$scope.sonarqubeyaml = 'kind: Template\napiVersion: v1\nmetadata:\n  annotations:\n    description: The SonarQube OpenShift template\n    tags: instant-app,sonarqube\n  name: sonarqube\nmessage: \"Login to SonarQube with the default admin user: admin\/admin\"\nobjects:\n- apiVersion: v1\n  kind: Service\n  metadata:\n    name: sonarqube\n    labels:\n      app: sonarqube\n  spec:\n    ports:\n    - name: sonarqube\n      port: 9000\n      protocol: TCP\n      targetPort: 9000\n    selector:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    sessionAffinity: None\n    type: ClusterIP\n- apiVersion: v1\n  kind: Route\n  metadata:\n    annotations:\n      description: Route for SonarQube\'s http service.\n    name: sonarqube\n    labels:\n      app: sonarqube\n  spec:\n    to:\n      kind: Service\n      name: sonarqube\n- apiVersion: v1\n  kind: ImageStream\n  metadata:\n    labels:\n      app: sonarqube\n    name: sonarqube\n  spec:\n    tags:\n    - annotations:\n        description: The SonarQube Docker image\n        tags: sonarqube\n      from:\n        kind: DockerImage\n        name: openshiftdemos\/sonarqube:${SONARQUBE_VERSION}\n      importPolicy: {}\n      name: ${SONARQUBE_VERSION}\n- apiVersion: v1\n  kind: DeploymentConfig\n  metadata:\n    labels:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    name: sonarqube\n  spec:\n    replicas: 1\n    selector:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    strategy:\n      resources: {}\n      rollingParams:\n        intervalSeconds: 1\n        maxSurge: 25%\n        maxUnavailable: 25%\n        timeoutSeconds: 600\n        updatePeriodSeconds: 1\n      type: Rolling\n    template:\n      metadata:\n        annotations:\n          openshift.io\/container.sonarqube.image.entrypoint: \'[\".\/bin\/run.sh\"]\'\n        creationTimestamp: null\n        labels:\n          app: sonarqube\n          deploymentconfig: sonarqube\n      spec:\n        containers:\n        - image: \' \'\n          imagePullPolicy: IfNotPresent\n          name: sonarqube\n          ports:\n          - containerPort: 9000\n            protocol: TCP\n          livenessProbe:\n            failureThreshold: 5\n            initialDelaySeconds: 180\n            periodSeconds: 20\n            successThreshold: 1\n            httpGet:\n              port: 9000\n              path: \/\n            timeoutSeconds: 5\n          readinessProbe:\n            failureThreshold: 5\n            initialDelaySeconds: 60\n            periodSeconds: 20\n            successThreshold: 1\n            httpGet:\n              port: 9000\n              path: \/\n            timeoutSeconds: 5\n          resources:\n            requests:\n              cpu: 200m\n              memory: 1Gi\n            limits:\n              cpu: 1\n              memory: ${SONAR_MAX_MEMORY}\n          terminationMessagePath: \/dev\/termination-log\n          volumeMounts:\n          - mountPath: \/opt\/sonarqube\/data\n            name: sonarqube-data\n        dnsPolicy: ClusterFirst\n        restartPolicy: Always\n        securityContext: {}\n        terminationGracePeriodSeconds: 30\n        volumes:\n        - name: sonarqube-data\n          persistentVolumeClaim:\n            claimName: sonarqube-data\n    triggers:\n    - type: ConfigChange\n    - imageChangeParams:\n        automatic: true\n        containerNames:\n        - sonarqube\n        from:\n          kind: ImageStreamTag\n          name: sonarqube:${SONARQUBE_VERSION}\n      type: ImageChange\n- apiVersion: v1\n  kind: PersistentVolumeClaim\n  metadata:\n    name: sonarqube-data\n  spec:\n    accessModes:\n    - ReadWriteOnce\n    resources:\n      requests:\n        storage: ${SONAR_VOLUME_CAPACITY}\nparameters:\n- displayName: SonarQube version\n  value: \"6.7\"\n  name: SONARQUBE_VERSION\n  required: true\n- description: Volume space available for SonarQube\n  displayName: SonarQube Volume Capacity\n  name: SONAR_VOLUME_CAPACITY\n  required: true\n  value: 1Gi\n- displayName: SonarQube Max Memory\n  name: SONAR_MAX_MEMORY\n  required: true\n  value: 2Gi';
					$scope.sonarqubepostgresql = 'kind: Template\napiVersion: v1\nmetadata:\n  annotations:\n    description: The SonarQube OpenShift template\n    tags: instant-app,sonarqube\n  name: sonarqube\nmessage: \"Login to SonarQube with the default admin user: admin\/admin\"\nobjects:\n- apiVersion: v1\n  kind: Service\n  metadata:\n    name: sonarqube\n    labels:\n      app: sonarqube\n  spec:\n    ports:\n    - name: sonarqube\n      port: 9000\n      protocol: TCP\n      targetPort: 9000\n    selector:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    sessionAffinity: None\n    type: ClusterIP\n- apiVersion: v1\n  kind: Route\n  metadata:\n    annotations:\n      description: Route for SonarQube\'s http service.\n    name: sonarqube\n    labels:\n      app: sonarqube\n  spec:\n    to:\n      kind: Service\n      name: sonarqube\n- apiVersion: v1\n  kind: ImageStream\n  metadata:\n    labels:\n      app: sonarqube\n    name: sonarqube\n  spec:\n    tags:\n    - annotations:\n        description: The SonarQube Docker image\n        tags: sonarqube\n      from:\n        kind: DockerImage\n        name: openshiftdemos\/sonarqube:${SONARQUBE_VERSION}\n      importPolicy: {}\n      name: ${SONARQUBE_VERSION}\n- apiVersion: v1\n  kind: DeploymentConfig\n  metadata:\n    labels:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    name: sonarqube\n  spec:\n    replicas: 1\n    selector:\n      app: sonarqube\n      deploymentconfig: sonarqube\n    strategy:\n      resources: {}\n      rollingParams:\n        intervalSeconds: 1\n        maxSurge: 25%\n        maxUnavailable: 25%\n        timeoutSeconds: 600\n        updatePeriodSeconds: 1\n      type: Rolling\n    template:\n      metadata:\n        annotations:\n          openshift.io\/container.sonarqube.image.entrypoint: \'[\".\/bin\/run.sh\"]\'\n        creationTimestamp: null\n        labels:\n          app: sonarqube\n          deploymentconfig: sonarqube\n      spec:\n        containers:\n        - env:\n          - name: SONARQUBE_JDBC_PASSWORD\n            value: ${POSTGRESQL_PASSWORD}\n          - name: SONARQUBE_JDBC_URL\n            value: jdbc:postgresql:\/\/postgresql-sonarqube\/sonar\n          - name: SONARQUBE_JDBC_USERNAME\n            value: sonar\n          image: \' \'\n          imagePullPolicy: IfNotPresent\n          name: sonarqube\n          ports:\n          - containerPort: 9000\n            protocol: TCP\n          livenessProbe:\n            failureThreshold: 3\n            initialDelaySeconds: 60\n            periodSeconds: 20\n            successThreshold: 1\n            httpGet:\n              port: 9000\n              path: \/\n            timeoutSeconds: 5\n          readinessProbe:\n            failureThreshold: 3\n            initialDelaySeconds: 60\n            periodSeconds: 20\n            successThreshold: 1\n            httpGet:\n              port: 9000\n              path: \/\n            timeoutSeconds: 5\n          resources:\n            requests:\n              cpu: 200m\n              memory: 1Gi\n            limits:\n              cpu: 1\n              memory: 2Gi\n          terminationMessagePath: \/dev\/termination-log\n          volumeMounts:\n          - mountPath: \/opt\/sonarqube\/data\n            name: sonarqube-data\n        dnsPolicy: ClusterFirst\n        restartPolicy: Always\n        securityContext: {}\n        terminationGracePeriodSeconds: 30\n        volumes:\n        - name: sonarqube-data\n          persistentVolumeClaim:\n            claimName: sonarqube-data\n    triggers:\n    - type: ConfigChange\n    - imageChangeParams:\n        automatic: true\n        containerNames:\n        - sonarqube\n        from:\n          kind: ImageStreamTag\n          name: sonarqube:${SONARQUBE_VERSION}\n      type: ImageChange\n- apiVersion: v1\n  kind: Service\n  metadata:\n    name: postgresql-sonarqube\n    labels:\n      app: sonarqube\n  spec:\n    ports:\n    - name: postgresql\n      port: 5432\n      protocol: TCP\n      targetPort: 5432\n    selector:\n      app: sonarqube\n      deploymentconfig: postgresql-sonarqube\n    sessionAffinity: None\n    type: ClusterIP\n- apiVersion: v1\n  kind: DeploymentConfig\n  metadata:\n    labels:\n      app: sonarqube\n      deploymentconfig: postgresql-sonarqube\n    name: postgresql-sonarqube\n  spec:\n    replicas: 1\n    selector:\n      app: sonarqube\n      deploymentconfig: postgresql-sonarqube\n    strategy:\n      recreateParams:\n        timeoutSeconds: 600\n      resources: {}\n      type: Recreate\n    template:\n      metadata:\n        labels:\n          app: sonarqube\n          deploymentconfig: postgresql-sonarqube\n      spec:\n        containers:\n        - env:\n          - name: POSTGRESQL_USER\n            value: sonar\n          - name: POSTGRESQL_PASSWORD\n            value: ${POSTGRESQL_PASSWORD}\n          - name: POSTGRESQL_DATABASE\n            value: sonar\n          image: \' \'\n          imagePullPolicy: IfNotPresent\n          livenessProbe:\n            failureThreshold: 3\n            initialDelaySeconds: 30\n            periodSeconds: 10\n            successThreshold: 1\n            tcpSocket:\n              port: 5432\n            timeoutSeconds: 1\n          name: postgresql\n          ports:\n          - containerPort: 5432\n            protocol: TCP\n          readinessProbe:\n            exec:\n              command:\n              - \/bin\/sh\n              - -i\n              - -c\n              - psql -h 127.0.0.1 -U $POSTGRESQL_USER -q -d $POSTGRESQL_DATABASE -c \'SELECT 1\'\n            failureThreshold: 3\n            initialDelaySeconds: 5\n            periodSeconds: 10\n            successThreshold: 1\n            timeoutSeconds: 1\n          resources:\n            limits:\n              memory: 256Mi\n          securityContext:\n            capabilities: {}\n            privileged: false\n          terminationMessagePath: \/dev\/termination-log\n          volumeMounts:\n          - mountPath: \/var\/lib\/pgsql\/data\n            name: postgresql-data\n        dnsPolicy: ClusterFirst\n        restartPolicy: Always\n        securityContext: {}\n        terminationGracePeriodSeconds: 30\n        volumes:\n        - name: postgresql-data\n          persistentVolumeClaim:\n            claimName: postgresql-sonarqube-data\n    test: false\n    triggers:\n    - imageChangeParams:\n        automatic: true\n        containerNames:\n        - postgresql\n        from:\n          kind: ImageStreamTag\n          name: postgresql:9.5\n          namespace: openshift\n      type: ImageChange\n    - type: ConfigChange\n- apiVersion: v1\n  kind: PersistentVolumeClaim\n  metadata:\n    name: postgresql-sonarqube-data\n  spec:\n    accessModes:\n    - ReadWriteOnce\n    resources:\n      requests:\n        storage: ${POSTGRESQL_VOLUME_CAPACITY}\n- apiVersion: v1\n  kind: PersistentVolumeClaim\n  metadata:\n    name: sonarqube-data\n  spec:\n    accessModes:\n    - ReadWriteOnce\n    resources:\n      requests:\n        storage: ${SONAR_VOLUME_CAPACITY}\nparameters:\n- displayName: SonarQube version\n  value: \"6.7\"\n  name: SONARQUBE_VERSION\n  required: true\n- description: Password for SonarQube Server PostgreSQL backend\n  displayName: SonarQube\'s PostgreSQL Password\n  from: \'[a-zA-Z0-9]{16}\'\n  generate: expression\n  name: POSTGRESQL_PASSWORD\n  required: true\n- description: Volume space available for PostgreSQL\n  displayName: PostgreSQL Volume Capacity\n  name: POSTGRESQL_VOLUME_CAPACITY\n  required: true\n  value: 1Gi\n- description: Volume space available for SonarQube\n  displayName: SonarQube Volume Capacity\n  name: SONAR_VOLUME_CAPACITY\n  required: true\n  value: 1Gi';
				});
