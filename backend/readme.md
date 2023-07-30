// Forgot password Processes <br>
#1. User clicks on forgot Password<br>
#2. Create a reset token (string) and save in our database<br>
#3. Send reset token to user email in the form of a link<br>
#4. When User clicks the link, compare the reset token in the link with that saved in the database<br>
#5. If they match, change reset the user's Password<br><br><br>

// Forgot Password Steps<br>
#1. Create forget Password Route<br>
#2. Create Token Model<br>
#3. Create Email Sender Function<br>
#4. Create Controller Function<br>

#in update data
#image: Object.keys(fileData).length === 0 ? product?.image : fileData

