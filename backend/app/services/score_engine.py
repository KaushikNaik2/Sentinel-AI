"""
Sentinel-AI — Security Score Engine
Calculates holistic security score based on breaches, anomalies, processes, and network threats.
"""


class ScoreEngine:

    def calculate(
        self,
        breaches: list,
        anomaly_count: int,
        flagged_processes: int,
        bad_connections: int,
    ) -> dict:
        """
        Calculate security score from 0-100.
        Starts at 100 and applies weighted deductions.
        """
        score = 100

        # Deductions
        breach_penalty = min(len(breaches) * 12, 40)
        anomaly_penalty = min(anomaly_count * 5, 20)
        process_penalty = min(flagged_processes * 8, 24)
        network_penalty = min(bad_connections * 15, 30)

        score -= breach_penalty
        score -= anomaly_penalty
        score -= process_penalty
        score -= network_penalty

        # Extra penalty if passwords were exposed in breaches
        password_breach = any(
            "Passwords" in b.get("data_exposed", []) for b in breaches
        )
        if password_breach:
            score -= 15

        score = max(0, min(score, 100))

        return {
            "score":     score,
            "grade":     self._grade(score),
            "label":     self._label(score),
            "breakdown": {
                "breaches":  breach_penalty,
                "anomalies": anomaly_penalty,
                "processes": process_penalty,
                "network":   network_penalty,
            }
        }

    def _grade(self, score: int) -> str:
        if score >= 80:
            return "A"
        if score >= 60:
            return "B"
        if score >= 40:
            return "C"
        return "F"

    def _label(self, score: int) -> str:
        if score >= 80:
            return "Good"
        if score >= 60:
            return "Fair"
        if score >= 40:
            return "Poor"
        return "Critical"


score_engine = ScoreEngine()
