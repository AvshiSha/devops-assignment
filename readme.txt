How I handle this assignment

1. I have created a new GitHub repository, and a two files, one is for the client, and one is for the server, while the server is listening in port 3000.
The server is has only one endpoint, which is a GET '/status'.
2. For the server i used 'express' package
3. You can run the program with a script located in the /pacakge.json file.
   You can run the server by do the command "node src/server.js" in the CLI.

4. For the assigmnet in segment 3, i created a in the directory '.github/actions/call-node-api/' and a yml inside, which is getting an
 input of api-url, and needs to prints a markdown summary (as expalined in the assignment), and updates README.md based on that.

5. The update of the README file logic is in the index.js, located inside the same directory as the action.yml file.
 mainly pushes at the buttom if there is not a status, otherwise, delete the old content and replace it with the new content.
 For this file, i use '@actions/core' package, which is a Github package, helping for building custom actions, like i did in here.

6. At the end, i created the call-api.yml file in the ".github/workflows/call-api.yml" directory, which is creating the Workflow of the program we created.
 I've created the following workflow (as it is written in the assignment):
   - Trigger manually in GitHub using workflow_dispatch
   - Checkout the repository
   - Install Node.js
   - Install project dependencies
   - Start the Node.js API in the background 
   - Calling GitHub Action:
       uses: ./.github/actions/call-node-api 
       with: 
        api-url: http://localhost:3000/status
   - Commit the updated README.md back into the repository.
     -- I used GITHUB_TOKEN like this: env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     -- I give permissions with the 'contents: write'.

7. My README contains in each update of the README content, these placeholders:
<!-- API_STATUS_START --> 
<!-- API_STATUS_END -->

8. I hope everything is clear, Thank you for the opportunity!

Avshi
