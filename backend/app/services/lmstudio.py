"""
Sentinel-AI — LM Studio Service
OpenAI-compatible API client for local LLM inference.
Supports both regular and streaming completions.
"""

import httpx
import json
import logging
from app.config import settings

logger = logging.getLogger("sentinel-ai.lmstudio")


class LMStudioClient:
    def __init__(self):
        self.base_url = settings.LM_STUDIO_BASE_URL
        self.model = settings.LM_STUDIO_MODEL

    async def complete(self, messages: list[dict], temperature: float = 0.3) -> str:
        """Single completion — returns full response text."""
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": 1024,
                        "stream": False,
                    }
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.ConnectError:
            logger.error("LM Studio not reachable at %s", self.base_url)
            return '{"error": "LM Studio is not running. Please start LM Studio with a model loaded on port 1234."}'
        except httpx.TimeoutException:
            logger.error("LM Studio request timed out")
            return '{"error": "LM Studio request timed out. The model may be overloaded."}'
        except Exception as e:
            logger.error("LM Studio error: %s", str(e))
            return '{"error": "An error occurred while processing your request."}'

    async def stream(self, messages: list[dict], temperature: float = 0.3):
        """Streaming completion — yields text chunks for SSE."""
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat/completions",
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": 1024,
                        "stream": True,
                    }
                ) as response:
                    async for line in response.aiter_lines():
                        if line.startswith("data: ") and line != "data: [DONE]":
                            try:
                                chunk = json.loads(line[6:])
                                delta = chunk["choices"][0]["delta"].get("content", "")
                                if delta:
                                    yield delta
                            except json.JSONDecodeError:
                                continue
        except httpx.ConnectError:
            logger.error("LM Studio not reachable at %s", self.base_url)
            yield "Error: LM Studio is not running. Please start LM Studio with a model loaded."
        except httpx.TimeoutException:
            logger.error("LM Studio streaming timed out")
            yield "Error: Request timed out."
        except Exception as e:
            logger.error("LM Studio streaming error: %s", str(e))
            yield "Error: An error occurred during streaming."

    async def is_available(self) -> bool:
        """Check if LM Studio is running and accessible."""
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(f"{self.base_url}/models")
                return resp.status_code == 200
        except Exception:
            return False


lm_client = LMStudioClient()
