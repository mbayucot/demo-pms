node {
  def url = 'https://github.com/mbayucot/demo.git'
  def credentialsId = 'xxx-xxx-xxx-xxx-xxx'

  stage('Build') {
        git branch: branch, credentialsId: credentialsId, url: url

        dir('deploy/demo-app') {
          sh 'sudo make configure-cluster'
          sh 'sudo make push-images'
        }
  }

  stage('Deploy') {
        dir('deploy/demo-app') {
          sh 'sudo make deploy'
        }
  }
}