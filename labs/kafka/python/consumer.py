import json
import time

from confluent_kafka import Consumer, KafkaException


BOOTSTRAP_SERVERS = "localhost:9092"
TOPIC = "orders.events"
GROUP_ID = "orders-learning-consumer"
AUTO_OFFSET_RESET = "earliest"
PROCESSING_DELAY_SECONDS = 0


def process_event(event):
    print(
        "processing",
        {
            "event_type": event["event_type"],
            "order_id": event["order_id"],
            "event_id": event["event_id"],
        },
    )
    time.sleep(PROCESSING_DELAY_SECONDS)


def main():
    consumer = Consumer(
        {
            "bootstrap.servers": BOOTSTRAP_SERVERS,
            "group.id": GROUP_ID,
            "auto.offset.reset": AUTO_OFFSET_RESET,
            "enable.auto.commit": False,
        }
    )

    consumer.subscribe([TOPIC])

    try:
        while True:
            message = consumer.poll(1.0)

            if message is None:
                continue

            if message.error():
                raise KafkaException(message.error())

            event = json.loads(message.value().decode("utf-8"))
            process_event(event)

            consumer.commit(message=message, asynchronous=False)
            print(
                "committed",
                {
                    "partition": message.partition(),
                    "offset": message.offset(),
                    "key": message.key().decode("utf-8") if message.key() else None,
                },
            )
    finally:
        consumer.close()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("consumer stopped")
