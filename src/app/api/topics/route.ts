
import { NextResponse } from 'next/server';

const topics = [
  {
    title: 'Arrays & Hashing',
    description: 'Problems involving array manipulations and hashing techniques.',
  },
  {
    title: 'Two Pointers',
    description: 'Problems that can be solved efficiently using two pointers.',
  },
  {
    title: 'Sliding Window',
    description: 'Technique for problems on contiguous subarrays or substrings.',
  },
  {
    title: 'Stack',
    description: 'Problems involving the stack data structure for LIFO operations.',
  },
  {
    title: 'Binary Search',
    description: 'Efficient search algorithm for sorted arrays.',
  },
  {
    title: 'Linked List',
    description: 'Problems related to the linked list data structure.',
  },
  {
    title: 'Trees',
    description: 'Problems involving tree data structures, traversal, and properties.',
  },
  {
    title: 'Tries',
    description: 'Tree-like data structure for efficient string searching.',
  },
  {
    title: 'Heap / Priority Queue',
    description: 'Problems involving priority queues and heap data structures.',
  },
  {
    title: 'Backtracking',
    description: 'Algorithmic technique for solving problems recursively.',
  },
  {
    title: 'Graphs',
    description: 'Problems involving graph traversal, shortest path, and other algorithms.',
  },
  {
    title: 'Advanced Graphs',
    description: 'More complex graph algorithms and concepts.',
  },
  {
    title: '1-D Dynamic Programming',
    description: 'Dynamic programming problems with a 1-D state.',
  },
  {
    title: '2-D Dynamic Programming',
    description: 'Dynamic programming problems with a 2-D state.',
  },
  {
    title: 'Greedy',
    description: 'Problems that can be solved by making locally optimal choices.',
  },
  {
    title: 'Intervals',
    description: 'Problems involving intervals, merging, and scheduling.',
  },
  {
    title: 'Bit Manipulation',
    description: 'Problems that require manipulation of bits and binary representations.',
  },
];

export async function GET() {
  return NextResponse.json(topics);
}
