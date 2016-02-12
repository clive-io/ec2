import bcrypt
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

# https://boto3.readthedocs.org/en/latest/guide/dynamodb.html
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ec2.clive.io-subdomains')

def getAllUsers():
  

def createUser(username, password):
  passsalt = bcrypt.gensalt()
  
  if userExists(username):
    return False
  else:
    table.put_item(Item={
      'username': username,
      'passhash': bcrypt.hashpw(password, passsalt),
      'passsalt': passsalt
    })
    return True

def userExists(username):
  response = table.query(KeyConditionExpression=Key('username').eq(username))
  return len(response['Items']) > 0

def passMatches(username, password):
  userinfo = getUserInfo(username)
  return bcrypt.hashpw(password, userinfo['passsalt']) == userinfo['passhash']

def getUserInfo(username):
  return table.query(KeyConditionExpression=Key('username').eq(username))['Items'][0]

def deleteUser(username):
  if userExists(username):
    table.delete_item(Key={'username':username})
    return True
  else:
    return False
