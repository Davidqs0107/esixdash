node () {
    properties(
        [
            parameters([
                 string(defaultValue: 'https://dev.e6tech.net/api/partner/restful', name: 'partnerEndpoint'),
                 string(defaultValue: 'quarterdeck', name: 'baseName') ])
        ]
    )
    try {
        environment {
            NODE_HOME = tool name: 'node-14.17.6', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        }
        nodejs(nodeJSInstallationName: 'node-14.17.6') {
            stage ('Checkout') {
                milestone()
                checkout scm
                env.REACT_APP_PARTNER_ENDPOINT="${partnerEndpoint}"
                env.REACT_APP_BASENAME="${baseName}"
                env.NODE_OPTS="--max-old-space-size=4096"
            }

            dir("web/quarterdeck") {
                stage ('Test') {
                    sh "rm -rf node_modules"
                    sh "yarn install"
                    sh "yarn run test:ci --silent"
                }
                stage ('Build') {
                    sh "yarn run bootstrap"
                    sh "yarn run build:aio"
                }

                stage ('Produce Tarball') {
                    sh 'version=$(git rev-parse --short HEAD); mv dist quarterdeck-$version; tar -zcvf quarterdeck-$version.tgz quarterdeck-$version'
                }
            }
        }
    }
    catch (e) {
        // sh doesn't cause build result to be set correctly by default
        currentBuild.result = 'FAILURE'
        throw e
    }
    finally {
        stage ('Post build actions') {
            junit 'web/quarterdeck/junit.xml'
            archiveArtifacts artifacts: "web/quarterdeck/quarterdeck-*.tgz"
            step([$class: 'CoberturaPublisher', coberturaReportFile: 'web/quarterdeck/coverage/cobertura-coverage.xml'])
            if (currentBuild.result == 'FAILURE') {
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: "culprits", sendToIndividuals: true])
            }
        }
    }
}