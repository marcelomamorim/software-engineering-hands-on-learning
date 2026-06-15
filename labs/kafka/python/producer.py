import json
import random
import time
from datetime import datetime, timezone
from uuid import uuid4

from confluent_kafka import Producer


BOOTSTRAP_SERVERS = "localhost:9092"
TOPIC = "orders.events"


def delivery_report(error, message):
    if error is not None:
        print(f"delivery failed: {error}")
        return

    print(
        "delivered",
        {
            "topic": message.topic(),
            "partition": message.partition(),
            "offset": message.offset(),
            "key": message.key().decode("utf-8") if message.key() else None,
        },
    )


def build_event(order_id):
    return {
        "event_id": str(uuid4()),
        "event_type": random.choice(
            ["OrderCreated", "PaymentApproved", "StockReserved", "OrderShipped"]
        ),
        "order_id": order_id,
        "customer_id": f"customer-{random.randint(1, 5)}",
        "amount": round(random.uniform(25, 500), 2),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def main():
    producer = Producer(
        {
            "bootstrap.servers": BOOTSTRAP_SERVERS,
            "acks": "all",
            "enable.idempotence": True,
        }
    )

    order_ids = [f"order-{number}" for number in range(1, 6)]

    while True:
        order_id = random.choice(order_ids)
        event = build_event(order_id)

        producer.produce(
            TOPIC,
            key=order_id.encode("utf-8"),
            value=json.dumps(event).encode("utf-8"),
            callback=delivery_report,
        )
        producer.poll(0)
        time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("producer stopped")
