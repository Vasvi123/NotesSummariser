# Notes Summariser - AI-Powered Meeting Notes Summarizer

A full-stack web application that uses **Grok AI** (xAI's AI model) to summarize meeting transcripts and notes, with the ability to customize output formats and share summaries via email.

## Features

- **AI-Powered Summarization**: Generate structured summaries using Grok AI (xAI's advanced model)
- **Custom Instructions**: Specify how you want your summary formatted (e.g., "bullet points for executives", "action items only")
- **File Upload Support**: Upload text files (.txt, .md, .doc, .docx) or paste text directly
- **Editable Summaries**: Edit and customize generated summaries before sharing
- **Email Sharing**: Send summaries to multiple recipients with professional formatting
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Feedback**: Toast notifications and loading states for better UX

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Grok AI API** (xAI) for AI summarization
- **Nodemailer** for email functionality
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Modern CSS** with responsive design

## Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **Grok API Key** - Get one from [xAI Platform](https://console.x.ai/)
3. **Email Service Credentials** (Gmail recommended for testing)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NotesSummariser
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Grok API Configuration
   GROK_API_KEY=your_grok_api_key_here
   GROK_API_URL=https://api.x.ai/v1
   GROK_MODEL=grok-beta
   GROK_MAX_TOKENS=1000
   GROK_TEMPERATURE=0.7
   
   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

## Grok API Setup

1. **Get Grok API Key:**
   - Visit [xAI Console](https://console.x.ai/)
   - Sign up/login to your xAI account
   - Navigate to API keys section
   - Generate a new API key

2. **API Configuration:**
   - The default model is `grok-beta` (latest Grok model)
   - Adjust `GROK_MAX_TOKENS` for summary length
   - Modify `GROK_TEMPERATURE` for creativity (0.0 = focused, 1.0 = creative)

## Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in your `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start both the backend server (port 5000) and frontend (port 5173) concurrently.

### Production Mode
```bash
npm run build
npm start
```

### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## Usage

1. **Navigate to the home page** (`http://localhost:5173`)
2. **Upload or paste your meeting transcript**
3. **Enter custom instructions** for how you want the summary formatted
4. **Click "Generate Summary"** to create an AI-powered summary using Grok
5. **Edit the summary** if needed using the inline editor
6. **Share via email** by entering recipient addresses and customizing the message

## API Endpoints

### Summary Generation
- `POST /api/summary/generate` - Generate AI summary using Grok
- `PUT /api/summary/update` - Update existing summary

### Email Functionality
- `POST /api/email/send` - Send summary via email
- `GET /api/email/test` - Test email configuration

### Health Check
- `GET /api/health` - Server status

## Project Structure

```
NotesSummariser/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   └── routes/            # API routes
│       ├── summary.js     # Grok AI summary endpoints
│       └── email.js       # Email endpoints
├── client/                # React Vite frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── package.json            # Backend dependencies
├── env.example            # Environment variables template
└── README.md              # This file
```

## Customization

### AI Model
- Change the Grok model in `.env` (e.g., `grok-beta`, `grok-alpha`)
- Adjust `GROK_MAX_TOKENS` and `GROK_TEMPERATURE` in `.env`
- Modify API endpoint in `server/routes/summary.js` if needed

### Email Templates
- Modify the email HTML template in `server/routes/email.js`
- Customize styling and branding

### UI/UX
- Edit CSS in `client/src/App.css`
- Modify React components in `client/src/`

## Troubleshooting

### Common Issues

1. **Grok API Error 401**
   - Check your API key in `.env`
   - Ensure you have sufficient credits in your xAI account
   - Verify the API key is active

2. **Grok API Error 400**
   - Check request format and parameters
   - Ensure transcript and prompt are not empty
   - Verify model name is correct

3. **Email Sending Failed**
   - Verify email credentials in `.env`
   - Check if 2FA and app passwords are set up correctly
   - Test email configuration with `/api/email/test`

4. **CORS Issues**
   - Ensure `CLIENT_URL` in `.env` matches your frontend URL
   - Check that the backend is running on the correct port

5. **Port Already in Use**
   - Change the port in `.env` or kill the process using the port
   - Use `npx kill-port 5000` to free up port 5000

### Performance Tips

- Use `grok-beta` for the latest model capabilities
- Adjust `GROK_MAX_TOKENS` based on your needs
- Implement rate limiting for production use
- Add caching for frequently requested summaries
- Use environment-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the console logs for error details
3. Ensure all environment variables are set correctly
4. Verify Grok API key and credentials are valid
5. Check xAI console for API usage and limits

## Future Enhancements

- [ ] Database integration for saving summaries
- [ ] User authentication and accounts
- [ ] Multiple AI model support (Grok, OpenAI, Claude)
- [ ] Summary templates and presets
- [ ] Export to PDF/Word
- [ ] Team collaboration features
- [ ] API rate limiting and monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
