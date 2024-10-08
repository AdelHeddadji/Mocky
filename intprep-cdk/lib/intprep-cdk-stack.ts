import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs'; // Correct import for Construct in CDK v2
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'; // Import from aws-cdk-lib

export class IntprepCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table for storing user data with a sort key
    const usersTable = new dynamodb.Table(this, 'Users', {
      partitionKey: { name: 'username', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING }, // New sort key added
      tableName: 'Users',
    });

    // Output the table name for reference
    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      description: 'Name of the DynamoDB Users table',
    });
  }
}

