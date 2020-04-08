/**
 * Root application for single-spa
 * example taken from https://bit.ly/2USHugQ
 */
import {
    start,
    registerApplication
} from 'single-spa';


registerApplication(
    'page1',
    () => import('../main.js'),
    location => location.pathname.startsWith('/')
)
start();
// location => location.hash.startsWith('#/app1')