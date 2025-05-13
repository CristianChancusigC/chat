from openai import OpenAI

client = OpenAI(api_key="your_api_key_here")

message =  [{"role": "system", "content": "Eres un asistente virtual."}]

while True:
    user_input = input("Tu: ")
    if user_input.lower() == "salir":
        print("Saliendo del chat.")
        break
    message.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=message,
        max_tokens=100,)

    print(response.choices[0].text.strip())
    assistant_response =  response.choices[0].message.content
    print(f"Asistente:  {assistant_response}")