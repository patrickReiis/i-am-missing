// Polyfill for AbortSignal.any and AbortSignal.timeout
// This is needed for older browsers that don't support these methods

// Add the any method to AbortSignal if it doesn't exist
if (!('any' in AbortSignal)) {
  Object.defineProperty(AbortSignal, 'any', {
    value: function(signals: AbortSignal[]): AbortSignal {
      const controller = new AbortController();
      
      // When any signal aborts, abort the controller
      for (const signal of signals) {
        if (signal.aborted) {
          controller.abort(signal.reason);
          return controller.signal;
        }
        
        signal.addEventListener('abort', () => {
          controller.abort(signal.reason);
        }, { once: true });
      }
      
      return controller.signal;
    },
    writable: true,
    configurable: true,
  });
}

// Add the timeout method to AbortSignal if it doesn't exist
if (!('timeout' in AbortSignal)) {
  Object.defineProperty(AbortSignal, 'timeout', {
    value: function(milliseconds: number): AbortSignal {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException('TimeoutError', 'Timeout')), milliseconds);
      return controller.signal;
    },
    writable: true,
    configurable: true,
  });
}