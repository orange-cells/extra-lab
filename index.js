import express from 'express';
import zlib from 'zlib';
import multer from 'multer';
import appSource from './app.js';

const app = appSource(express, zlib, multer);

app.listen(process.env.PORT);
