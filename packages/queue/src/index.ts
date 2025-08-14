import "dotenv/config";
import * as ioredis from "ioredis";

export const redis = new ioredis.Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  // retryDelayOnFailover: 100,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export interface JobData {
  mediaId: string;
  storageBucketKey: string;
  action: string;
  userId?: string;
  metadata?: any;
}

export interface Job {
  id: string;
  data: JobData;
  attempts: number;
  maxRetries: number;
  createdAt: Date;
  processAfter?: Date;
}

export class MediaJobQueue {
  private queueName: string;

  constructor(queueName: string = "media-processing") {
    this.queueName = queueName;
  }

  async addJob(jobData: JobData): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const job: Job = {
      id: jobId,
      data: jobData,
      attempts: 0,
      maxRetries: 3,
      createdAt: new Date(),
    };

    await redis.lpush(this.queueName, JSON.stringify(job));
    console.log(`Added job ${jobId} to ${this.queueName}`);
    return jobId;
  }
}

export const mediaQueue = new MediaJobQueue("media-processing");

export async function addToQueue(jobData: JobData) {
  return mediaQueue.addJob(jobData);
}
