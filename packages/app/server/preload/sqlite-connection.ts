import { PrismaConnection } from '@abyss/records';
import { contextBridge } from 'electron';

export const connection = new PrismaConnection();

contextBridge.exposeInMainWorld('abyss-sqlite', connection.export());
