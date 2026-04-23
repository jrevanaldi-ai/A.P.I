import { NextResponse } from "next/server";

/**
 * Memory Guard Utility
 * Memastikan penggunaan memori (RSS) tidak melewati ambang batas tertentu.
 * Batas diatur ke 2.8GB agar ada ruang sebelum mencapai hard limit 3GB.
 */
const MEMORY_LIMIT_MB = 2800; 

export function checkMemoryUsage() {
  // rss: Resident Set Size - jumlah total memori yang digunakan oleh proses Node.js
  const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
  
  if (memoryUsage > MEMORY_LIMIT_MB) {
    console.warn(`[MemoryGuard] High memory usage detected: ${Math.round(memoryUsage)}MB. Blocking request.`);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server sedang mengalami beban tinggi (Memori penuh). Silakan coba lagi nanti." 
      }, 
      { 
        status: 503,
        headers: {
            "Retry-After": "30"
        }
      }
    );
  }
  return null;
}
