prompt1 = f"""
    1. Send an automatic reply to the sender of the email with the following message:
        "Thank you for your email. We have received it and will get back to you shortly"
        using GMAIL_REPLY_TO_THREAD action & if any attachments are present, use GMAIL_SEND_EMAIL send that too.
    2. Check if the email subject (subject) or body (messageText) in the payload contains any of the keywords specified in this dictionary: {[{'slackChannel': 'dev-channel', 'email': 'hrishikeshvastrad14@gmail.com', 'keywords': 'bugs, errors, issues'}, {'slackChannel': 'growth-channel', 'email': 'mskarthikugalawat@gmail.com', 'keywords': 'Collaboration, partnership, sponser'}, {'slackChannel': 'hrishikesh-channel', 'email': 'hrishikesh@gmail.com', 'keywords': 'bill'}]}.
    3. If a keyword match is found:
        a. Check if the original email contains any attachments.
        b. If attachments are present, use the GMAIL_GET_ATTACHMENT action to download them.
        c. Send the email payload to the corresponding email address and slack channel. And if attachments are present include the downloaded attachments.
        message: 'Forwarded email: subject & body'
    Payload: {payload}
    """
prompt2 = f"""
    1. Check if the email subject (subject) or body (messageText) in the payload contains any of the keywords specified in this dictionary: {keywords}.
    2. If a keyword match is found:
        a. Check if the original email contains any attachments.
        b. If attachments are present, use the GMAIL_GET_ATTACHMENT action to download them.
        c. Send the email payload to the corresponding email address and slack channel. And if attachments are present include the downloaded attachments.
        message: 'Forwarded email: subject & body'
    Payload: {payload}
    """