export const renderVerificationSuccess = (user, role) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Verified - Coders App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f7fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #ffffff; max-width: 480px; width: 100%; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); text-align: center; }
    .icon { width: 64px; height: 64px; background: #def7ec; color: #0e9f6e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
    h1 { color: #1a202c; font-size: 24px; margin-bottom: 12px; }
    p { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .badge { display: inline-block; background-color: #ebf5ff; color: #1e429f; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-transform: capitalize; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #3182ce; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; transition: background-color 0.2s; }
    .btn:hover { background-color: #2b6cb0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <span class="badge">${role}</span>
    <h1>Account Verified!</h1>
    <p>Hello <strong>${user.firstName}</strong>, your email <strong>${user.email}</strong> has been successfully verified. You can now log in to the Coders platform and start your journey.</p>
    <a href="/" class="btn">Go to Dashboard</a>
  </div>
</body>
</html>
`;

export const renderVerificationError = (message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Failed - Coders App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f7fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #ffffff; max-width: 480px; width: 100%; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); text-align: center; }
    .icon { width: 64px; height: 64px; background: #fde8e8; color: #e02424; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
    h1 { color: #1a202c; font-size: 24px; margin-bottom: 12px; }
    p { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; transition: background-color 0.2s; }
    .btn:hover { background-color: #c53030; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✕</div>
    <h1>Verification Failed</h1>
    <p>${message}</p>
    <a href="/" class="btn">Return to Home</a>
  </div>
</body>
</html>
`;
