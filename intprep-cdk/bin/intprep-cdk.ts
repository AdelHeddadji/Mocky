#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntprepCdkStack } from '../lib/intprep-cdk-stack';
import { Construct } from 'constructs';  // Correct Construct import for CDK v2

const app = new cdk.App();
new IntprepCdkStack(app, 'IntprepCdkStack', {
  env: { account: 'account-id', region: 'us-east-1' }
});
