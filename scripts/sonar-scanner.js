import dotenv from 'dotenv';
import process from 'node:process';
import { scan } from 'sonarqube-scanner';

dotenv.config();
const sonarToken = process.env.SONAR_TOKEN;

scan(
  {
    serverUrl: 'http://localhost:9000',
    token: sonarToken,
    login: sonarToken,
    options: {
      'sonar.projectName': 'candlezone',
      'sonar.projectKey': 'candlezone',
      'sonar.projectDescription': 'Analyze stocks your way',
      'sonar.projectVersion': '2024.04.0',
      'sonar.sources': 'src',
      'sonar.token': sonarToken,
      'sonar.tests': 'tests',
      'sonar.scm.disabled': 'true',
      'sonar.javascript.environments': 'node',
      'sonar.exclusions':
        'node_modules/**,.extras/**,.scannerwork/*,.vscode/*,coverage/**,dist/*,log/*',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
    },
  },
  () => process.exit(),
);
