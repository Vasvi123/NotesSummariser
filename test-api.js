const express = require('express');
const createClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");
require('dotenv').config();

// Test the GitHub AI configuration
async function testGitHubAI() {
  try {
    console.log('🔍 Testing GitHub AI Configuration...');
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_ENDPOINT = process.env.GITHUB_ENDPOINT || "https://models.github.ai/inference";
    const GITHUB_MODEL = process.env.GITHUB_MODEL || "openai/gpt-4o-mini";
    
    console.log('📋 Configuration:');
    console.log('  Token:', GITHUB_TOKEN ? '✅ Configured' : '❌ Missing');
    console.log('  Endpoint:', GITHUB_ENDPOINT);
    console.log('  Model:', GITHUB_MODEL);
    
    if (!GITHUB_TOKEN) {
      console.log('❌ Error: GitHub token not configured!');
      console.log('💡 Please check your .env file');
      return;
    }
    
    console.log('\n🚀 Testing API call...');
    
    // Create GitHub AI client
    const client = createClient(
      GITHUB_ENDPOINT,
      new AzureKeyCredential(GITHUB_TOKEN)
    );
    
    // Test with a simple prompt
    const testTranscript = "This is a test meeting transcript. We discussed project timelines and assigned tasks to team members.";
    const testPrompt = "Summarize in bullet points";
    
    console.log('📝 Test data:');
    console.log('  Transcript:', testTranscript);
    console.log('  Prompt:', testPrompt);
    
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { 
            role: "system", 
            content: "You are an expert meeting notes summarizer. Summarize the transcript according to the user's requirements." 
          },
          { 
            role: "user", 
            content: `Requirements: ${testPrompt}\n\nTranscript: ${testTranscript}` 
          }
        ],
        model: GITHUB_MODEL,
        max_tokens: 500,
        temperature: 0.7,
      }
    });
    
    if (isUnexpected(response)) {
      console.log('❌ API Error:', response.body.error);
      return;
    }
    
    console.log('✅ API call successful!');
    console.log('📄 Response:', response.body.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ Error testing GitHub AI:', error.message);
    console.log('🔍 Full error:', error);
  }
}

// Run the test
testGitHubAI();
