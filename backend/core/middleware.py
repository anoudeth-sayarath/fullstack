import time

class PerformanceMonitorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        response = self.get_response(request)

        duration = (time.time() - start_time) * 1000

        print(f"[PERF] path: {request.path} | Method: {request.method} | Speed: {duration:.2f} ms")

        return response