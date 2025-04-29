import { PrismaConnection } from '@abyss/records';
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('sqlite', new PrismaConnection());
