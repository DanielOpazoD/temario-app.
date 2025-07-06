/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY as string;

// --- Icon Definitions ---
const ICONS: { [key: string]: string } = {
    default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>`,
    cardio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.218 15.218 0 01-2.134-1.335L4.11 16.649a15.217 15.217 0 01-1.335-2.134 15.247 15.247 0 01-.597-1.383l-.012-.022-.003-.007a.75.75 0 01.011-1.05l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64 1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0L9.938 8.12a15.217 15.217 0 01-1.335-2.134 15.247 15.247 0 01-.597-1.383l-.012-.022-.003-.007a.75.75 0 01.01-1.05l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64 1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0L6.39 4.43a15.217 15.217 0 01-2.134-1.335 15.247 15.247 0 01-1.383-.597l-.022-.012-.007-.003a.75.75 0 01.01-1.05l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.218 15.218 0 01-2.134-1.335L.332 9.25a15.217 15.217 0 01-1.335-2.134A15.247 15.247 0 01-.597 5.733l-.012-.022-.003-.007a.75.75 0 01.01-1.05l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0L.01 4.43a15.217 15.217 0 01-1.335-2.134A15.247 15.247 0 01-.597 1.012l-.012-.022L-.612.983a.75.75 0 01.01-1.05l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06L2.062 2.64l1.64 1.64a.75.75 0 010 1.06L2.062 6.98l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64L.34 2.057a15.217 15.217 0 011.335-2.134A15.247 15.247 0 013.272-.597l.022-.012.007-.003a.75.75 0 011.05.01l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 010 1.06l1.64 1.64 1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64 1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64 1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64-1.64-1.64a.75.75 0 010-1.06l1.64-1.64 1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64 1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 010-1.06l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 011.06 0l1.64-1.64a.75.75 0 011.06 0l1.64 1.64a.75.75 0 010 1.06l-1.64 1.64a.75.75 0 01-1.06 0l-1.64-1.64a.75.75 0 01-1.06 0l-1.64 1.64a.75.75 0 01-1.06 0z" /></svg>`,
    neumo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" /><path fill-rule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75c-.621 0-1.125-.504-1.125-1.125V4.125z" clip-rule="evenodd" /></svg>`,
    nefro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path fill-rule="evenodd" d="M8.25 3.75a3.75 3.75 0 00-3.75 3.75v.518c0 .193.023.382.068.568L6 11.25v2.25a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V11.25l1.432-2.712a.75.75 0 011.088-.286l1.838.919a.75.75 0 00.916-.251l1.691-2.254a.75.75 0 011.214-.043l1.83 2.745a.75.75 0 001.214-.043l.83-1.246a3.75 3.75 0 00-1.214-5.262V3.75a3.75 3.75 0 00-3.75-3.75h-9zM7.5 7.5a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v.135a.75.75 0 00-.01-.02l-.83 1.245a.75.75 0 01-1.214.043l-1.83-2.745a.75.75 0 00-1.214.043L13.69 8.46a.75.75 0 01-.916.251l-1.838-.919a.75.75 0 00-1.088.286L8.432 10.8a.75.75 0 01-.068.14L7.5 9.135V7.5z" clip-rule="evenodd" /></svg>`,
    digestivo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A32.095 32.095 0 0113.31 18.27l-5.657-5.657a.75.75 0 00-1.061 1.061l5.657 5.657a32.11 32.11 0 01-4.76.626.75.75 0 00-.75.75v.002a.75.75 0 00.75.75l.17.005a33.6 33.6 0 005.152-.682.75.75 0 00.672-1.033 32.09 32.09 0 00-1.08-11.873.75.75 0 00-1.053-1.07Z" clip-rule="evenodd" /></svg>`,
    metabolismo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M14.615 1.585a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-3.512l-7.444 4.963a.75.75 0 01-1.11-.814l1.583-4.752a.75.75 0 011.11.814l-.805 2.416 6.33-4.22a.75.75 0 01.814.288zM6.262 3.111a.75.75 0 01.814 1.11l-4.963 7.444v3.512a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.288-.814l4.22-6.33-.288-.814a.75.75 0 011.11-.814zM10.159 10.85a.75.75 0 01.814-1.11l4.963-7.444-3.512 0a.75.75 0 010-1.5h4.5a.75.75 0 01.814.288l6.33 4.22-.814.288a.75.75 0 01-.814-1.11l2.416-.805a.75.75 0 01.814 1.11l-4.752 1.583a.75.75 0 01-.814-1.11z" clip-rule="evenodd" /></svg>`,
    hemato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm15 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" /><path d="M12 2.25c-5.523 0-10 3.023-10 6.75s4.477 6.75 10 6.75 10-3.023 10-6.75S17.523 2.25 12 2.25zM4.067 9.172a8.513 8.513 0 015.197-2.618 1.5 1.5 0 10-.728-2.887 11.513 11.513 0 00-6.98 3.593.75.75 0 00.255 1.05A.75.75 0 004.067 9.172zM12 14.25a7.5 7.5 0 01-7.443-7.009A.75.75 0 003.75 6.75a.75.75 0 00-.525.223A8.995 8.995 0 002.25 9c0 3.866 4.03 7 9 7s9-3.134 9-7c0-.28-.013-.559-.038-.83a.75.75 0 00-.472-.663A.75.75 0 0019.5 7.5a.75.75 0 00-.568.243A7.5 7.5 0 0112 14.25z" /></svg>`,
    neuro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9.75a4.5 4.5 0 11-8.528-2.227.75.75 0 00-1.428.473A6 6 0 1017.25 9.75a.75.75 0 00-1.5 0z" /><path d="M12 3.75a.75.75 0 00-.75.75V11.25a.75.75 0 001.5 0V4.5a.75.75 0 00-.75-.75z" /><path d="M12.75 12.75a.75.75 0 00-1.5 0v5.69l-1.846-1.615a.75.75 0 00-1.016 1.102l3.25 2.844a.75.75 0 001.016 0l3.25-2.844a.75.75 0 10-1.016-1.102L12.75 18.44v-5.69z" /></svg>`,
    reumato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" /></svg>`,
    infecto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" /></svg>`,
};


document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Cache ---
    const getElem = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
    const tableBody = getElem('table-body');
    const linkModal = getElem('link-modal');
    const notesModal = getElem('notes-modal');
    const notesModalTitle = getElem('notes-modal-title');
    const notesEditor = getElem('notes-editor');
    const editorToolbar = notesModal.querySelector('.editor-toolbar') as HTMLElement;
    const linkInput = getElem('link-input') as HTMLInputElement;
    const saveLinkBtn = getElem('save-link-btn');
    const cancelLinkBtn = getElem('cancel-link-btn');
    const openLinkPreviewBtn = getElem('open-link-preview') as HTMLAnchorElement;
    const saveNoteBtn = getElem('save-note-btn');
    const cancelNoteBtn = getElem('cancel-note-btn');
    const printNoteBtn = getElem('print-note-btn');
    const deleteNoteBtn = getElem('delete-note-btn');
    const copyNoteTextBtn = getElem('copy-note-text-btn');
    const searchBar = getElem('search-bar') as HTMLInputElement;
    const progressBar = getElem('progress-bar');
    const generateGeminiNotesBtn = getElem('generate-gemini-notes');
    const askAiBtn = getElem('ask-ai-btn');
    const aiQaModal = getElem('ai-qa-modal');
    const aiResponseArea = getElem('ai-response-area');
    const aiQaLoader = getElem('ai-qa-loader');
    const aiQuestionInput = getElem('ai-question-input') as HTMLTextAreaElement;
    const cancelAiQaBtn = getElem('cancel-ai-qa-btn');
    const sendAiQaBtn = getElem('send-ai-qa-btn') as HTMLButtonElement;
    const exportBtn = getElem('export-btn');
    const importBtn = getElem('import-btn');
    const importFileInput = getElem('import-file-input') as HTMLInputElement;
    const settingsBtn = getElem('settings-btn');
    const settingsDropdown = getElem('settings-dropdown');
    const confidenceFiltersContainer = getElem('confidence-filters');
    const iconPickerModal = getElem('icon-picker-modal');
    const iconPickerGrid = getElem('icon-picker-grid');
    const closeIconPickerBtn = getElem('close-icon-picker-btn');

    // --- State Variables ---
    let activeConfidenceFilter = 'all';
    let activeLinkCell: HTMLElement | null = null;
    let activeNoteIcon: HTMLElement | null = null;
    let activeSectionIconContainer: HTMLElement | null = null;

    const grandTotalSpans = {
        fuse: getElem('total-fuse'),
        notion: getElem('total-notion'),
        gemini: getElem('total-gemini'),
        lectura: getElem('total-lectura')
    };
    const grandPercentSpans = {
        fuse: getElem('percent-fuse'),
        notion: getElem('percent-notion'),
        gemini: getElem('percent-gemini'),
        lectura: getElem('percent-lectura')
    };
    const progressRings = {
        fuse: document.getElementById('progress-ring-fuse') as unknown as SVGCircleElement,
        notion: document.getElementById('progress-ring-notion') as unknown as SVGCircleElement,
        gemini: document.getElementById('progress-ring-gemini') as unknown as SVGCircleElement,
        lectura: document.getElementById('progress-ring-lectura') as unknown as SVGCircleElement,
    };
    
    const sections: { [key: string]: { headerRow: HTMLElement, totalRow: HTMLElement } } = {};
    document.querySelectorAll('[data-section-header]').forEach(headerEl => {
        const headerRow = headerEl as HTMLElement;
        const sectionName = headerRow.dataset.sectionHeader!;
        sections[sectionName] = {
            headerRow,
            totalRow: getElem(`total-row-${sectionName}`)
        };
    });

    // --- Core Logic Functions ---
    
    function createLinkCellContent(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.className = 'flex items-center justify-center space-x-2 h-full';

        const linkAnchor = document.createElement('a');
        linkAnchor.href = '#';
        linkAnchor.target = '_blank';
        linkAnchor.className = 'link-anchor';
        linkAnchor.style.display = 'none'; // Hidden by default
        linkAnchor.title = "Abrir enlace";
        linkAnchor.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" /><path d="M8.603 3.799a.75.75 0 00-1.17 1.044A4 4 0 009.25 9.75l.165-.01a.75.75 0 00.722-.843l-.105-.844a2.5 2.5 0 011.99-2.221.75.75 0 00.522-1.03l-1.106-2.212a.75.75 0 00-1.17-1.044z" /></svg>`;
        
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-link-icon opacity-50 hover:opacity-100';
        editIcon.title = "Agregar/editar enlace";
        editIcon.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" /><path d="M8.603 3.799a.75.75 0 00-1.17 1.044A4 4 0 009.25 9.75l.165-.01a.75.75 0 00.722-.843l-.105-.844a2.5 2.5 0 011.99-2.221.75.75 0 00.522-1.03l-1.106-2.212a.75.75 0 00-1.17-1.044z" /></svg>`;
        
        container.appendChild(linkAnchor);
        container.appendChild(editIcon);
        fragment.appendChild(container);
        return fragment;
    }
    
    function createLecturaCellContent(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.className = 'flex items-center justify-center space-x-1';
        
        const markSpan = document.createElement('span');
        markSpan.className = 'mark';
        
        const greyIcon = document.createElement('span');
        greyIcon.className = 'note-icon grey-icon';
        greyIcon.dataset.noteType = 'grey';
        greyIcon.title = 'Esquema';
        greyIcon.innerHTML = `<svg class="solid-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25z" clip-rule="evenodd" /></svg><svg class="outline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`;

        const blueIcon = document.createElement('span');
        blueIcon.className = 'note-icon blue-icon';
        blueIcon.dataset.noteType = 'blue';
        blueIcon.title = 'Desarrollo';
        blueIcon.innerHTML = `<svg class="solid-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg><svg class="outline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`;

        container.appendChild(markSpan);
        container.appendChild(greyIcon);
        container.appendChild(blueIcon);
        fragment.appendChild(container);
        return fragment;
    }
    
    function initializeCells() {
        document.querySelectorAll('td.fillable-cell[data-col]').forEach(cellEl => {
            const cell = cellEl as HTMLElement;
            cell.innerHTML = ''; // Clear existing content
            const col = cell.dataset.col;
            if (col === 'fuse' || col === 'notion' || col === 'gemini') {
                cell.appendChild(createLinkCellContent());
            } else if (col === 'lectura') {
                cell.appendChild(createLecturaCellContent());
            } else {
                 const markSpan = document.createElement('span');
                 markSpan.className = 'mark';
                 cell.appendChild(markSpan);
            }
        });

        document.querySelectorAll('tr[data-section] td:nth-child(2)').forEach((td) => {
            const topicTextSpan = document.createElement('span');
            topicTextSpan.className = 'topic-text';
            while (td.firstChild) {
                topicTextSpan.appendChild(td.firstChild);
            }
            td.innerHTML = ''; // Clear td before appending
            td.appendChild(topicTextSpan);
            
            const confidenceContainer = document.createElement('span');
            confidenceContainer.className = 'ml-2 inline-flex items-center align-middle';
            const confidenceDot = document.createElement('span');
            confidenceDot.className = 'confidence-dot';
            confidenceDot.dataset.confidenceLevel = '0';
            confidenceDot.title = "Nivel de confianza";
            confidenceContainer.appendChild(confidenceDot);
            td.appendChild(confidenceContainer);
        });
        
        document.querySelectorAll('.notes-cell').forEach(cell => {
             const cellEl = cell as HTMLElement;
             const content = cellEl.innerHTML;
             cellEl.innerHTML = '';
             cellEl.appendChild(createLecturaCellContent());
        });
    }

    // --- Totals and Progress Calculation ---
    function updateAllTotals() {
        const grandTotals = { fuse: 0, notion: 0, gemini: 0, lectura: 0 };
        const grandApplicable = { fuse: 0, notion: 0, gemini: 0, lectura: 0 };

        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const totalRowTds = sections[sectionName].totalRow.querySelectorAll('td');
            let colIndex = 1;
            ['fuse', 'notion', 'gemini', 'lectura'].forEach(col => {
                let sectionCompletedCount = 0;
                sectionRows.forEach(row => {
                    const cell = row.querySelector(`td[data-col="${col}"]`);
                    if (!cell) return;
                    const mark = cell.querySelector('.mark');
                    const valueStr = (mark?.textContent || '').trim();
                     if (valueStr === '1' || (col === 'lectura' && valueStr !== '')) {
                        sectionCompletedCount++;
                    }
                });
                totalRowTds[colIndex].textContent = String(sectionCompletedCount);
                grandTotals[col as keyof typeof grandTotals] += sectionCompletedCount;
                grandApplicable[col as keyof typeof grandApplicable] += sectionRows.length;
                colIndex++;
            });
        });
        
        let totalCompletedSum = 0;
        let totalApplicableSum = 0;

        ['fuse', 'notion', 'gemini', 'lectura'].forEach(colKey => {
            const col = colKey as keyof typeof grandTotals;
            const completedCount = grandTotals[col];
            const applicableCount = grandApplicable[col];

            totalCompletedSum += completedCount;
            totalApplicableSum += applicableCount;

            const percentage = applicableCount > 0 ? Math.round((completedCount / applicableCount) * 100) : 0;
            grandTotalSpans[col].textContent = String(completedCount);
            grandPercentSpans[col].textContent = `${percentage}%`;
            
            const ring = progressRings[col];
            if (ring) {
                const radius = ring.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                ring.style.strokeDasharray = `${circumference} ${circumference}`;
                const offset = circumference - (percentage / 100) * circumference;
                ring.style.strokeDashoffset = String(offset);
            }
        });
        
        const overallPercentage = totalApplicableSum > 0 ? (totalCompletedSum / totalApplicableSum) * 100 : 0;
        progressBar.style.width = overallPercentage + '%';
    }

    function updateSectionHeaderCounts() {
        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const count = sectionRows.length;
            const headerRow = sections[sectionName].headerRow;
            if (headerRow) {
                const countElement = headerRow.querySelector('.section-count');
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }
            }
        });
    }

    // --- Modal and State Management ---
    function loadNote(icon: HTMLElement, noteData: string, defaultTitle: string): string {
        if (!noteData) {
            icon.title = defaultTitle;
            icon.classList.remove('has-note');
            return '';
        }
    
        let noteContent: string | undefined = '';
        let lastModified: string | undefined;
    
        try {
            const parsed = JSON.parse(noteData);
            if (typeof parsed === 'object' && parsed !== null) {
                noteContent = parsed.content;
                lastModified = parsed.lastModified;
            } else {
                noteContent = noteData; // old format
            }
        } catch (e) {
            noteContent = noteData; // old format
        }
        
        icon.dataset.note = noteData;
        icon.classList.toggle('has-note', !!noteContent && noteContent.trim() !== '');
    
        if (lastModified) {
            const d = new Date(lastModified);
            const formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            icon.title = `${defaultTitle} (Modificado: ${formattedDate})`;
        } else {
            icon.title = defaultTitle;
        }
    
        return noteContent || '';
    }
    
    function closeModal(modal: HTMLElement) {
        modal.classList.remove('visible');
    }
    
    function openModal(modal: HTMLElement) {
        modal.classList.add('visible');
    }
    
    // --- Event Listeners ---
    tableBody.addEventListener('click', function (e) {
        const target = e.target as HTMLElement;

        const sectionHeader = target.closest('.section-header-row');
        if (sectionHeader && !target.closest('.note-icon') && !target.closest('.section-icon-container')) {
            const sectionName = (sectionHeader as HTMLElement).dataset.sectionHeader!;
            toggleSection(sectionName);
            saveState();
            return;
        }

        const confidenceDot = target.closest('.confidence-dot');
        if (confidenceDot) {
            e.stopPropagation();
            let level = parseInt((confidenceDot as HTMLElement).dataset.confidenceLevel || '0', 10);
            level = (level + 1) % 4; // Cycles 0 -> 1 -> 2 -> 3 -> 0
            (confidenceDot as HTMLElement).dataset.confidenceLevel = String(level);
            applyFiltersAndSearch();
            saveState();
            return;
        }

        const noteIcon = target.closest('.note-icon');
        if (noteIcon) {
            e.stopPropagation();
            activeNoteIcon = noteIcon as HTMLElement;
            let topicTitle = '';
            let defaultTooltip = '';
            const noteData = activeNoteIcon.dataset.note || '';

            if (activeNoteIcon.classList.contains('section-note-icon')) {
                const sectionHeader = activeNoteIcon.closest('.section-header-row');
                topicTitle = `Notas para: ${sectionHeader?.querySelector('.section-title')?.textContent || 'Sección'}`;
                defaultTooltip = 'Notas de la sección';
            } else {
                const row = activeNoteIcon.closest('tr');
                const topicText = row?.querySelector('.topic-text')?.textContent || 'Tema';
                const noteType = activeNoteIcon.dataset.noteType;
                topicTitle = `${noteType === 'grey' ? 'Esquema' : 'Desarrollo'} para: ${topicText}`;
                defaultTooltip = noteType === 'grey' ? 'Esquema' : 'Desarrollo';
            }
            
            notesModalTitle.textContent = topicTitle;
            const content = loadNote(activeNoteIcon, noteData, defaultTooltip);
            notesEditor.innerHTML = content;
            openModal(notesModal);
            notesEditor.focus();
            return;
        }

        const editLinkIcon = target.closest('.edit-link-icon');
        if (editLinkIcon) {
            e.stopPropagation();
            activeLinkCell = editLinkIcon.closest('td');
            if (activeLinkCell) {
                const linkAnchor = activeLinkCell.querySelector('.link-anchor') as HTMLAnchorElement;
                const currentHref = linkAnchor.getAttribute('href');
                linkInput.value = (currentHref && currentHref !== '#') ? currentHref : '';
                openLinkPreviewBtn.href = linkInput.value || '#';
                openModal(linkModal);
                linkInput.focus();
            }
            return;
        }

        const cell = target.closest('td.fillable-cell');
        if (!cell || target.closest('.note-icon')) return;

        const col = (cell as HTMLElement).dataset.col!;
        let markElement = cell.querySelector('.mark') as HTMLElement;
        if (!markElement) return;

        if (col === 'fuse' || col === 'notion' || col === 'gemini') {
            let currentValue = markElement.textContent?.trim() || '';
            let nextValue = '';
            if (currentValue === '') nextValue = '1';
            else if (currentValue === '1') nextValue = '0';
            else if (currentValue === '0') nextValue = '';
            markElement.textContent = nextValue;
            
            cell.classList.remove('filled', 'not-done');
            if (nextValue === "1") cell.classList.add('filled');
            else if (nextValue === "0") cell.classList.add('not-done');

        } else if (col === 'lectura') {
            let currentValue = parseInt(markElement.textContent?.trim() || '0', 10);
            currentValue = (currentValue + 1) % 6; // 0-5
            markElement.textContent = currentValue === 0 ? '' : String(currentValue);
            cell.classList.toggle('lectura-filled', currentValue > 0);
        }
        
        updateAllTotals();
        saveState();
    });

    // --- Editor Logic ---
    function setupEditorToolbar() {
        editorToolbar.innerHTML = `
            <button data-command="bold" title="Negrita" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><b>B</b></button>
            <button data-command="italic" title="Cursiva" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><i>I</i></button>
            <button data-command="underline" title="Subrayado" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><u>U</u></button>
            <select data-command="fontName" title="Fuente" class="text-sm border dark:bg-slate-700 rounded p-1 mx-1 focus:ring-0">
                <option>Arial</option><option>Verdana</option><option>Georgia</option>
            </select>
            <div class="color-palette" data-command="foreColor" title="Color de Texto">
                <span class="color-swatch" style="background-color: #111827;" data-value="#111827"></span>
                <span class="color-swatch" style="background-color: #3B82F6;" data-value="#3B82F6"></span>
                <span class="color-swatch" style="background-color: #22C55E;" data-value="#22C55E"></span>
                <label class="custom-color-picker">🎨<input type="color" value="#000000"></label>
            </div>
             <div class="color-palette" data-command="hiliteColor" title="Resaltado">
                <span class="color-swatch" style="background-color: #FEF9C3;" data-value="#FEF9C3"></span>
                <span class="color-swatch" style="background-color: #CFFAFE;" data-value="#CFFAFE"></span>
                <span class="color-swatch" style="background-color: #DCFCE7;" data-value="#DCFCE7"></span>
                <label class="custom-color-picker">🎨<input type="color" value="#FFFF00"></label>
            </div>
            <button data-command="insertUnorderedList" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Viñetas"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25z" clip-rule="evenodd" /></svg></button>
            <button data-command="insertOrderedList" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Lista Numerada"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v.5c0 .414-.336.75-.75.75h-.5A.75.75 0 012 4.5v-.5zM5.25 4.75a.75.75 0 000-1.5H2.75a.75.75 0 000 1.5h2.5zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm.75 4.25a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75z" clip-rule="evenodd" /></svg></button>
            <button data-command="undo" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Deshacer">↶</button>
            <button data-command="redo" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Rehacer">↷</button>
            <button id="improve-text-btn" class="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Mejorar texto con IA">✨</button>`;
        
        editorToolbar.addEventListener('mousedown', e => e.preventDefault());

        editorToolbar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('button[data-command]');
            if (button) {
                document.execCommand(button.dataset.command!, false, button.dataset.value || null);
                notesEditor.focus();
            }
        });

        editorToolbar.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement | HTMLInputElement;
            if ('dataset' in target && target.dataset.command) {
                document.execCommand(target.dataset.command, false, target.value);
            }
        });

        document.querySelectorAll('.color-palette').forEach(palette => {
            const command = (palette as HTMLElement).dataset.command!;
            palette.addEventListener('click', (e) => {
                const swatch = (e.target as HTMLElement).closest('.color-swatch');
                if (swatch && (swatch as HTMLElement).dataset.value) {
                    document.execCommand(command, false, (swatch as HTMLElement).dataset.value);
                }
            });
            const customPickerInput = palette.querySelector('input[type="color"]') as HTMLInputElement;
            if (customPickerInput) {
                customPickerInput.addEventListener('input', (e) => {
                    document.execCommand(command, false, (e.target as HTMLInputElement).value);
                }, false);
            }
        });
    }

    deleteNoteBtn.addEventListener('click', () => {
        if (activeNoteIcon && confirm('¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.')) {
            notesEditor.innerHTML = '';
            const noteData = JSON.stringify({ content: '', lastModified: new Date().toISOString() });
            activeNoteIcon.dataset.note = noteData;
            activeNoteIcon.classList.remove('has-note');
            let baseTitle = 'Nota';
            if (activeNoteIcon.classList.contains('section-note-icon')) {
                baseTitle = 'Notas de la sección';
            } else if (activeNoteIcon.dataset.noteType === 'grey') {
                baseTitle = 'Esquema';
            } else if (activeNoteIcon.dataset.noteType === 'blue') {
                baseTitle = 'Desarrollo';
            }
            activeNoteIcon.title = baseTitle;
            
            saveState(); // Save the cleared note
            closeModal(notesModal);
        }
    });

    saveLinkBtn.addEventListener('click', function () {
        if (!activeLinkCell) return;
        
        const linkAnchor = activeLinkCell.querySelector('.link-anchor') as HTMLAnchorElement;
        const editIcon = activeLinkCell.querySelector('.edit-link-icon') as HTMLElement;
        const url = linkInput.value.trim();

        if (url) {
            linkAnchor.href = url;
            linkAnchor.style.display = 'inline-flex';
            editIcon.classList.remove('opacity-50');
        } else {
            linkAnchor.href = '#';
            linkAnchor.style.display = 'none';
            editIcon.classList.add('opacity-50');
        }
        
        closeModal(linkModal);
        saveState();
    });

    saveNoteBtn.addEventListener('click', function () {
        if (activeNoteIcon) {
            const noteText = notesEditor.innerHTML;
            const noteObject = { content: noteText, lastModified: new Date().toISOString() };
            const noteData = JSON.stringify(noteObject);
            activeNoteIcon.dataset.note = noteData;
            
            let baseTitle = 'Nota';
            if(activeNoteIcon.classList.contains('section-note-icon')) baseTitle = 'Notas de sección';
            else if(activeNoteIcon.dataset.noteType === 'grey') baseTitle = 'Esquema';
            else if(activeNoteIcon.dataset.noteType === 'blue') baseTitle = 'Desarrollo';

            loadNote(activeNoteIcon, noteData, baseTitle);
            
            saveState();

            const confirmation = getElem('save-confirmation');
            confirmation.style.opacity = '1';
            setTimeout(() => { confirmation.style.opacity = '0'; }, 2000);
        }
    });
    
    // --- AI Integration ---
    async function callGemini(prompt: string) {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Error al comunicarse con la IA.";
        }
    }

    function stripHtml(html: string): string {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function gatherAllContent(): string {
        const content: string[] = [];
        document.querySelectorAll('.section-header-row').forEach(header => {
            const sectionName = (header as HTMLElement).dataset.sectionHeader;
            const sectionTitle = header.querySelector('.section-title')?.textContent;
            content.push(`\n## SECCIÓN: ${sectionTitle}\n`);

            const sectionNoteIcon = header.querySelector('.section-note-icon.has-note');
            if (sectionNoteIcon) {
                const noteContent = JSON.parse((sectionNoteIcon as HTMLElement).dataset.note || '{}').content;
                if(noteContent) content.push(`- Nota de sección: ${stripHtml(noteContent)}`);
            }

            document.querySelectorAll(`tr[data-section="${sectionName}"]`).forEach(row => {
                const topic = row.querySelector('.topic-text')?.textContent;
                content.push(`### Tema: ${topic}`);
                row.querySelectorAll('.note-icon.has-note').forEach(icon => {
                    const noteContent = JSON.parse((icon as HTMLElement).dataset.note || '{}').content;
                    const type = (icon as HTMLElement).dataset.noteType === 'grey' ? 'Esquema' : 'Desarrollo';
                    if (noteContent) content.push(`- ${type}: ${stripHtml(noteContent)}`);
                });
            });
        });
        return content.join('\n');
    }

    sendAiQaBtn.addEventListener('click', async () => {
        const question = aiQuestionInput.value;
        if (!question.trim()) return;

        aiQaLoader.style.display = 'block';
        aiResponseArea.innerHTML = '';
        sendAiQaBtn.disabled = true;

        const context = gatherAllContent();
        const prompt = `Basado en el siguiente temario de estudio, responde la pregunta del usuario. Sé conciso y directo, usando markdown simple para listas o negritas si es necesario. Contenido del temario:\n\n${context}\n\n---\n\nPregunta del usuario: "${question}"`;
        
        const responseText = await callGemini(prompt);
        
        // Basic markdown to HTML
        const formattedText = responseText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        aiResponseArea.innerHTML = formattedText;
        aiQaLoader.style.display = 'none';
        sendAiQaBtn.disabled = false;
    });

    // --- Search and Filter ---
    function applyFiltersAndSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        document.querySelectorAll('tr[data-section]').forEach(rowEl => {
            const row = rowEl as HTMLElement;
            const sectionName = row.dataset.section!;
            const headerRow = sections[sectionName].headerRow;
            
            if (headerRow.classList.contains('collapsed')) {
                row.style.display = 'none';
                return;
            }

            const topicText = row.querySelector('.topic-text')?.textContent?.toLowerCase() || '';
            const searchMatch = topicText.includes(searchTerm);
            
            const confidenceDot = row.querySelector('.confidence-dot') as HTMLElement;
            const confidenceLevel = confidenceDot.dataset.confidenceLevel || '0';
            const filterMatch = activeConfidenceFilter === 'all' || confidenceLevel === activeConfidenceFilter;

            row.style.display = searchMatch && filterMatch ? '' : 'none';
        });

        Object.values(sections).forEach(({ headerRow, totalRow }) => {
            const sectionName = headerRow.dataset.sectionHeader!;
            const isAnyRowVisible = !!document.querySelector(`tr[data-section="${sectionName}"][style*="display: "], tr[data-section="${sectionName}"]:not([style])`);
            const shouldBeVisible = isAnyRowVisible || !searchTerm;
            headerRow.style.display = shouldBeVisible ? '' : 'none';
            totalRow.style.display = shouldBeVisible ? '' : 'none';
        });
    }

    // --- Persistence ---
    const STORAGE_KEY = 'temarioMedicinaInternaData_v2';
    function saveState() {
        const state = {
            version: '2.0',
            headers: Array.from(document.querySelectorAll('thead th[contenteditable="true"]')).map(th => th.textContent),
            rows: Array.from(document.querySelectorAll('#table-body tr[data-section]')).map((row, index) => {
                const rowData: any = { cells: {}, confidenceLevel: '0' };
                row.querySelectorAll<HTMLElement>('td[data-col]').forEach(cell => {
                    const col = cell.dataset.col!;
                    const mark = cell.querySelector('.mark');
                    const value = mark?.textContent || '';
                    if (col === 'lectura') {
                        const noteGrey = cell.querySelector<HTMLElement>('.grey-icon')?.dataset.note || '';
                        const noteBlue = cell.querySelector<HTMLElement>('.blue-icon')?.dataset.note || '';
                        rowData.cells[col] = { value, noteGrey, noteBlue };
                    } else {
                        const link = cell.querySelector<HTMLAnchorElement>('a.link-anchor')?.getAttribute('href') || '#';
                        rowData.cells[col] = { value, link };
                    }
                });
                const confidenceDot = row.querySelector<HTMLElement>('.confidence-dot');
                rowData.confidenceLevel = confidenceDot?.dataset.confidenceLevel || '0';
                return rowData;
            }),
            collapsedSections: Array.from(document.querySelectorAll('.section-header-row.collapsed')).map(h => (h as HTMLElement).dataset.sectionHeader),
            sectionNotes: Object.fromEntries(
                Array.from(document.querySelectorAll('.section-note-icon')).map(icon => [
                    (icon.closest('.section-header-row') as HTMLElement).dataset.sectionHeader,
                    (icon as HTMLElement).dataset.note || ''
                ])
            ),
            sectionIcons: Object.fromEntries(
                 Array.from(document.querySelectorAll<HTMLElement>('.section-header-row .section-icon-container')).map(iconContainer => [
                    (iconContainer.closest('.section-header-row') as HTMLElement).dataset.sectionHeader!,
                    iconContainer.dataset.iconName || 'default'
                 ])
            ),
            appTheme: document.documentElement.dataset.theme || 'default',
            iconStyle: document.documentElement.dataset.iconStyle || 'solid',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadState(dataToLoad: any | null = null) {
        const savedData = dataToLoad ? null : localStorage.getItem(STORAGE_KEY);
        const data = dataToLoad || (savedData ? JSON.parse(savedData) : null);
        if (!data) return;

        applyAppTheme(data.appTheme || 'default');
        applyIconStyle(data.iconStyle || 'solid');

        if (data.rows) {
            document.querySelectorAll<HTMLElement>('#table-body tr[data-section]').forEach((row, index) => {
                const rowData = data.rows[index];
                if (!rowData) return;
                
                Object.entries(rowData.cells).forEach(([col, cellData]: [string, any]) => {
                    const cell = row.querySelector<HTMLElement>(`td[data-col="${col}"]`);
                    if (!cell) return;

                    const mark = cell.querySelector<HTMLElement>('.mark');
                    if (col === 'lectura') {
                        if (mark) mark.textContent = cellData.value;
                        cell.classList.toggle('lectura-filled', !!cellData.value);
                        loadNote(cell.querySelector<HTMLElement>('.grey-icon')!, cellData.noteGrey, 'Esquema');
                        loadNote(cell.querySelector<HTMLElement>('.blue-icon')!, cellData.noteBlue, 'Desarrollo');
                    } else {
                        if (mark) mark.textContent = cellData.value;
                        cell.classList.toggle('filled', cellData.value === '1');
                        cell.classList.toggle('not-done', cellData.value === '0');
                        const linkAnchor = cell.querySelector<HTMLAnchorElement>('.link-anchor');
                        const editIcon = cell.querySelector<HTMLElement>('.edit-link-icon');
                        if (linkAnchor && editIcon && cellData.link && cellData.link !== '#') {
                            linkAnchor.href = cellData.link;
                            linkAnchor.style.display = 'inline-flex';
                            editIcon.classList.remove('opacity-50');
                        }
                    }
                });

                const confidenceDot = row.querySelector<HTMLElement>('.confidence-dot');
                if (confidenceDot && rowData.confidenceLevel) {
                    confidenceDot.dataset.confidenceLevel = rowData.confidenceLevel;
                }
            });
        }
        
        if (data.sectionNotes) {
             Object.entries(data.sectionNotes).forEach(([sectionName, noteData]: [string, any]) => {
                const icon = document.querySelector(`.section-header-row[data-section-header="${sectionName}"] .section-note-icon`);
                if(icon) loadNote(icon as HTMLElement, noteData, 'Notas de la sección');
             });
        }
        
        if (data.sectionIcons) {
            Object.entries(data.sectionIcons).forEach(([sectionName, iconName]: [string, any]) => {
                const iconContainer = document.querySelector<HTMLElement>(`.section-header-row[data-section-header="${sectionName}"] .section-icon-container`);
                if(iconContainer) {
                    iconContainer.innerHTML = ICONS[iconName] || ICONS.default;
                    iconContainer.dataset.iconName = iconName;
                }
            });
        }

        if (data.collapsedSections) {
            data.collapsedSections.forEach((sectionName: string) => toggleSection(sectionName, true));
        }

        updateAllTotals();
        updateSectionHeaderCounts();
        applyFiltersAndSearch();
    }
    
    function toggleSection(sectionName: string, forceCollapse = false) {
        const headerRow = sections[sectionName].headerRow;
        if (!headerRow) return;

        const isCurrentlyCollapsed = headerRow.classList.contains('collapsed');
        if (forceCollapse && isCurrentlyCollapsed) return;
        if (!forceCollapse && !isCurrentlyCollapsed) headerRow.classList.add('collapsed');
        else headerRow.classList.remove('collapsed');

        const isCollapsed = headerRow.classList.contains('collapsed');
        let currentRow = headerRow.nextElementSibling as HTMLElement;
        while (currentRow && !currentRow.dataset.sectionHeader) {
            if (currentRow.dataset.section) {
                currentRow.style.display = isCollapsed ? 'none' : '';
            }
            currentRow = currentRow.nextElementSibling as HTMLElement;
        }
        if(!forceCollapse) applyFiltersAndSearch();
    }
    
    // --- Settings and UI ---
    function applyAppTheme(theme: string) {
        document.documentElement.dataset.theme = theme;
        if (theme === 'default') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        } else {
            document.documentElement.classList.remove('dark'); // Force light mode for specific themes unless they have dark variants
        }
    }

    function applyIconStyle(style: string) {
        document.documentElement.dataset.iconStyle = style;
    }

    // --- Init and Event Binding ---
    searchBar.addEventListener('input', applyFiltersAndSearch);
    confidenceFiltersContainer.addEventListener('click', (e) => {
        const filterButton = (e.target as HTMLElement).closest('.filter-btn');
        if (!filterButton) return;
        confidenceFiltersContainer.querySelector('.active')?.classList.remove('bg-white', 'dark:bg-slate-900', 'active');
        filterButton.classList.add('active', 'bg-white', 'dark:bg-slate-900');
        activeConfidenceFilter = (filterButton as HTMLElement).dataset.filter!;
        applyFiltersAndSearch();
    });

    cancelLinkBtn.addEventListener('click', () => closeModal(linkModal));
    linkModal.addEventListener('click', (e) => { if (e.target === linkModal) closeModal(linkModal); });
    cancelNoteBtn.addEventListener('click', () => closeModal(notesModal));
    notesModal.addEventListener('click', (e) => { if (e.target === notesModal) closeModal(notesModal); });
    askAiBtn.addEventListener('click', () => openModal(aiQaModal));
    cancelAiQaBtn.addEventListener('click', () => closeModal(aiQaModal));
    aiQaModal.addEventListener('click', (e) => { if (e.target === aiQaModal) closeModal(aiQaModal); });
    
    // --- Initial Load ---
    initializeCells();
    setupEditorToolbar();
    loadState();
});