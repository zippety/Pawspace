import { Space, PetProfile, SafetyScore } from './types';
import { SafetyAnalyzer } from './safety';
import { MatchingService } from './matching';
import { HfInference } from '@huggingface/inference';
import * as tf from '@tensorflow/tfjs-node';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

interface AgentMetrics {
  matchingAccuracy: number;
  safetyScore: number;
  userSatisfaction: number;
  systemHealth: number;
}

class MLComponent {
  private model: tf.Sequential;
  private scaler: tf.Sequential;

  constructor() {
    this.model = this.buildModel();
    this.scaler = this.buildScaler();
  }

  private buildModel(): tf.Sequential {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private buildScaler(): tf.Sequential {
    return tf.sequential();
  }

  async train(features: number[][], labels: number[]) {
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    await this.model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2
    });

    xs.dispose();
    ys.dispose();
  }

  async predict(features: number[][]): Promise<number[]> {
    const xs = tf.tensor2d(features);
    const predictions = await this.model.predict(xs) as tf.Tensor;
    const results = await predictions.array() as number[][];
    xs.dispose();
    predictions.dispose();
    return results.map(r => r[0]);
  }
}

class MonitorComponent {
  private metrics: AgentMetrics = {
    matchingAccuracy: 0,
    safetyScore: 0,
    userSatisfaction: 0,
    systemHealth: 100
  };

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI!);
      await client.close();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async checkAPIHealth(): Promise<boolean> {
    try {
      const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
      await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: 'test'
      });
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  async updateMetrics(newMatches: number, successfulMatches: number) {
    this.metrics.matchingAccuracy = (successfulMatches / newMatches) * 100;
    
    const dbHealth = await this.checkDatabaseHealth();
    const apiHealth = await this.checkAPIHealth();
    
    this.metrics.systemHealth = ((dbHealth ? 50 : 0) + (apiHealth ? 50 : 0));
  }

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }
}

class BackupComponent {
  private backupDir: string;
  
  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async backupMatchingData(data: any) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `matching_data_${timestamp}.json`);
    
    try {
      await fs.promises.writeFile(backupPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  async restoreFromBackup(timestamp: string) {
    const backupPath = path.join(this.backupDir, `matching_data_${timestamp}.json`);
    
    try {
      const data = await fs.promises.readFile(backupPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Restore failed:', error);
      return null;
    }
  }

  async cleanOldBackups(maxAge: number) {
    const files = await fs.promises.readdir(this.backupDir);
    const now = new Date();
    
    for (const file of files) {
      const filePath = path.join(this.backupDir, file);
      const stats = await fs.promises.stat(filePath);
      const age = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (age > maxAge) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}

export class EnhancedPawSpaceAgent {
  private mlComponent: MLComponent;
  private monitorComponent: MonitorComponent;
  private backupComponent: BackupComponent;
  private safetyAnalyzer: SafetyAnalyzer;
  private matchingService: MatchingService;

  constructor() {
    this.mlComponent = new MLComponent();
    this.monitorComponent = new MonitorComponent();
    this.backupComponent = new BackupComponent();
    this.safetyAnalyzer = new SafetyAnalyzer();
    this.matchingService = new MatchingService();

    this.initializeScheduledTasks();
  }

  private initializeScheduledTasks() {
    // Health monitoring every hour
    setInterval(() => this.monitorSystem(), 3600000);

    // Backup every 24 hours
    setInterval(() => this.backupSystem(), 86400000);

    // ML model training every week
    setInterval(() => this.trainModel(), 604800000);
  }

  private async monitorSystem() {
    const metrics = await this.monitorComponent.getMetrics();
    console.log('System Metrics:', metrics);

    if (metrics.systemHealth < 70) {
      // Alert system administrators
      console.error('System health is below threshold!');
    }
  }

  private async backupSystem() {
    const matchingData = await this.getMatchingData();
    await this.backupComponent.backupMatchingData(matchingData);
    await this.backupComponent.cleanOldBackups(30); // Keep 30 days of backups
  }

  private async trainModel() {
    const trainingData = await this.getTrainingData();
    if (trainingData.features.length > 0) {
      await this.mlComponent.train(trainingData.features, trainingData.labels);
    }
  }

  private async getMatchingData() {
    // Implement data collection from MongoDB
    return {};
  }

  private async getTrainingData() {
    // Implement training data collection
    return {
      features: [],
      labels: []
    };
  }

  // Public API
  async findOptimalMatch(pet: PetProfile, spaces: Space[]) {
    const safetyScores = await Promise.all(
      spaces.map(space => this.safetyAnalyzer.analyzeSafety(space, pet))
    );

    const matches = await this.matchingService.findMatches(
      { petProfile: pet },
      spaces
    );

    // Enhance matches with ML predictions
    const features = this.prepareFeatures(pet, spaces);
    const predictions = await this.mlComponent.predict(features);

    const enhancedMatches = matches.map((match, i) => ({
      ...match,
      mlScore: predictions[i],
      safetyScore: safetyScores[i]
    }));

    return enhancedMatches.sort((a, b) => b.mlScore - a.mlScore);
  }

  private prepareFeatures(pet: PetProfile, spaces: Space[]): number[][] {
    // Convert pet and space attributes to numerical features
    return spaces.map(space => {
      return [
        pet.age,
        pet.size === 'small' ? 0 : pet.size === 'medium' ? 1 : 2,
        space.size,
        space.capacity,
        space.features.length,
        space.safetyFeatures.length,
        space.amenities.length,
        // Add more relevant features
      ];
    });
  }

  async getSystemHealth() {
    return this.monitorComponent.getMetrics();
  }

  async backupNow() {
    return this.backupSystem();
  }

  async restoreFromBackup(timestamp: string) {
    return this.backupComponent.restoreFromBackup(timestamp);
  }
}
