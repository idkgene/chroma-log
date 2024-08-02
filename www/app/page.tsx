'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export default function Home() {
  const [usageCode, setUsageCode] = useState('')
  const [configCode, setConfigCode] = useState('')

  useEffect(() => {
    async function highlightCode() {
      const usage = await codeToHtml(
        `
import { ChromaLog } from 'chroma-log';

const logger = new ChromaLog();

logger.info('Hello, ChromaLog!');
logger.warn('This is a warning');
logger.error('An error occurred');
logger.debug('Debugging information');

logger.time('Operation');
// ... some operation
logger.timeEnd('Operation');
      `,
        { lang: 'typescript', theme: 'github-dark' },
      )

      const config = await codeToHtml(
        `
const logger = new ChromaLog({
  showTimestamp: true,
  showFileName: true,
  timeFormat: "HH:mm:ss",
  customColors: {
    info: "blue",
    warn: "yellow",
    error: "red",
    debug: "green"
  },
  logToFile: true,
  logDirectory: "./logs",
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
  minLogLevel: "debug",
  logFormat: "{level} {timestamp} {fileName} {message}"
});
      `,
        { lang: 'typescript', theme: 'github-dark' },
      )

      setUsageCode(usage)
      setConfigCode(config)
    }

    highlightCode()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">ChromaLog</h1>
        <p className="text-xl text-center mb-12">
          Beautiful, customizable console logging for Node.js and TypeScript
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What makes ChromaLog special</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Colorful and customizable log output</li>
              <li>Support for different log levels</li>
              <li>Timestamp and filename display options</li>
              <li>File logging with rotation</li>
              <li>Performance timing utilities</li>
            </ul>
          </CardContent>
        </Card>

        <Tabs
          defaultValue="usage"
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: usageCode }} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="output">
            <Card>
              <CardHeader>
                <CardTitle>Console Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono">
                  <p>
                    <span className="text-cyan-400">INFO</span> [14:30:25]
                    [app.js] Hello, ChromaLog!
                  </p>
                  <p>
                    <span className="text-yellow-400">WARN</span> [14:30:26]
                    [app.js] This is a warning
                  </p>
                  <p>
                    <span className="text-red-400">ERROR</span> [14:30:27]
                    [app.js] An error occurred
                  </p>
                  <p>
                    <span className="text-magenta-400">DEBUG</span> [14:30:28]
                    [app.js] Debugging information
                  </p>
                  <p>
                    <span className="text-cyan-400">INFO</span> [14:30:29]
                    [app.js] Operation: 1234.56 ms
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Installation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Install ChromaLog using npm:</p>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>npm install chroma-log</code>
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Customize ChromaLog to fit your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: configCode }} />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <a
              href="https://github.com/changeelog/chroma-log"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; 2024 ChromaLog. All rights reserved.</p>
      </footer>
    </div>
  )
}
