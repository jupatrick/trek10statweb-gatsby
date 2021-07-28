Because github will not allow me to upload an entire gatsby or craft site -

Steps to set up gatsby and craft sites locally and source data through each:

1. Deploy a gatsby site following the Gatsby tutorial.
    - I run mine through powershell using npm, it runs on http://localhost:8000/
    - Gatsby plugins to download: gatsby-source-filesystem, gatsby-source-graphql, gatsby-source-craft, gatsby-plugin-sharp, gatsby-transformer-sharp, gatsby-plugin-image. Some of these might need more configuring with gatsby-config.js, but some do not. 
    - Create env.development and env.production files in the main gatsby site directory, do not worry about adding anything to these, yet. 
2. Deploy a craft cms site following their tutorial.
    - This was very complicated for me on Windows, the normal tutorial, the one involving nitro, downloading through terminal, and setting up in browser from the basic tutorial only got me party downloaded. 
    - I set up local Apache and MySQL servers on xxamp and run my craft site on this. My craft site runs on port 3306 on a MySQL server, but it can also be run on a postgres server. I did not find docker useful in my final local environment, but that could be different for real world use. I found a very small youtube tutorial that had my one successful set up, the link will be attached right here if I can find it again:...
3. Set up an S3 volume in AWS.
    - This can be temporary to establish the connection and show how it works.
    - For the sake of this setup, the bucket I've created is public. This is the bucket policy that allows craft to read out of the bucket. (The name of my bucket is craftside3demo1)
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::craftside3demo1/*"
        }
    ]
}

4. Within your craft dashboard, download the Amazon S3 plugin. 
    - After this plugin is downloaded, go to settings and create a new asset. Set the volume type to Amazon S3. Make the base url the url of your S3 bucket.
    - For the Access Key ID, you will need to make an IAM user in AWS that has access to this S3 bucket. Create an IAM user and attach the following policy to give access to the right S3 bucket. 
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:ListStorageLensConfigurations",
                "s3:ListAccessPointsForObjectLambda",
                "s3:GetAccessPoint",
                "s3:PutAccountPublicAccessBlock",
                "s3:GetAccountPublicAccessBlock",
                "s3:ListAllMyBuckets",
                "s3:ListAccessPoints",
                "s3:ListJobs",
                "s3:PutStorageLensConfiguration",
                "s3:CreateJob"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::(name of your bucket here)",
                "arn:aws:s3:::*/*"
            ]
        }
    ]
}
    - Under security credentials of this user, make an access key ID, copy and paste both the public and secret keys into the respective boxes in craft. The secret key only show when you create the key, so keep that handy incase you the creation screen.
    - Under bucket, choose the name of the S3 bucket you just set up. I also enabled the "Make uploads public" so I can import files to my craft asset and have them be uploaded to the S3 bucket as well. 
    - If you have configured a CloudFront distribution in front of your bucket, which I chose to do, add the CloudFront distribution ID. I don't think this is necessary for a local environment, but it is good practice for scaling.
    - Go to utilities and clear your caches first, then the asset should be able to pull and upload from the S3 bucket. Also in utilities, go to asset indexes and enable caching of remote images if it is not already. 
5. Now in the craft dashboard under GraphQL, go to schemas. In your public schema, allow all the elements, entries, assets, etc. you have. Under Gatsby, check the allow sourcing box.
6. Also under GraphQL, create a private schema with the same configurations as your public one. Also create a token that has access to this private schema. Copy the Authorization header of this token to you notes somewhere.
7. Now go back to your IDE with your Gatsby site. Under gatsby-config, add all the plugins from above if you haven't already. However, some of these need configuring. 
    - In the env.development and env.production files you created, add the following lines with the correct data for your sites.
AUTHENTICATION_TOKEN = (authentication key from token you made)
CRAFTGQL_TOKEN = (token name)
CRAFTGQL_URL = (url of your craft site with "/api" added to the end) (in my case this was http://localhost/craft/web/api)
    - Configure these two plugins in the gatsby-config file
{
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: 'CraftAPI', (*This is to be seen in the graphQL interface, can be any name you want*)
        fieldName: 'craftAPI', (*This is to be seen in the graphQL interface, can be any name you want*)
        url: 'http://localhost/craft/web/api', (*The url from your env files*)
        headers: {
          Authorization: `bearer ${process.env.AUTHENTICATION_TOKEN}`,
        }, (*This path should pull from your env files to use the tokan*)
      }
    },
    {
      resolve: `gatsby-source-craft`,
      options: {
        craftGqlToken: '(your token authentication token, but placed here directly)',
        craftGqlUrl: `http://localhost/craft/web/api` (*The url from your env files*)
      }
    },
    
    
- With these configurations, your gatsby site should be able to query data through GraphQL to pull through craft, pulling from your S3 bucket. 
    
- Contact me with questions at any given step, I am sure there are parts that slipped my mind or do not seem as straightforward: jupatric@umich.edu
