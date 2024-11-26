# to run this code you first have to copy and paste the whole code into colab
# after running the model you will have ngrok api
# copy that api from colab and paste it into frontend
# then your colab server is running on port 8000 


# !pip install fastapi uvicorn nest-asyncio pyngrok chromadb



# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List
# import uvicorn
# import nest_asyncio
# from pyngrok import ngrok
# import chromadb
# from chromadb.utils import embedding_functions
# import asyncio
# import os

# # Enable nested async support for Colab
# nest_asyncio.apply()

# # Initialize ChromaDB
# chroma_client = chromadb.PersistentClient(path="./chroma_db")
# sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
#     model_name="all-MiniLM-L6-v2"
# )

# # Initialize collection
# collection = chroma_client.get_or_create_collection(
#     name="faq_collection",
#     embedding_function=sentence_transformer_ef
# )

# # Pydantic models
# class Query(BaseModel):
#     text: str

# class QAResponse(BaseModel):
#     question: str
#     answer: str

# class BotResponse(BaseModel):
#     responses: List[QAResponse]

# # FAQ data
# FAQ_DATA = [
#     {
#         "question": "What does the pricing structure of the Juntrax-Integrated Business Operations solution look like?",
#         "answer": "Our pricing structure is designed to be flexible and scalable based on your organization's needs. Several pricing models allow you to choose the plan that fits your organization, our pricing page has more details."
#     },
#     {
#                 "question": "How is the subscription fee determined?",
#                 "answer": "The subscription fee is determined based on your plan selection and the number of users accessing the system monthly or annually. We offer different tiers to accommodate businesses of all sizes, from startups to mid-market organizations. If you require help with data conversion, it is billed separately."
#             },
#             {
#                 "question": "Is there a per-user pricing model?",
#                 "answer": "Yes, we offer a per-user pricing model. In this model, you pay a fixed fee for each user accessing the system. This fee may vary depending on the plan and term you choose. Additional discounts are available on our pricing calculator."
#             },
#             {
#                 "question": "Are there any Setup, Trial, or Implementation fees?",
#                 "answer": "We offer everyone a free 15-day trial. There are no setup fees. Data conversion will be charged based on the scope of work involved and the development hours required. After assessing your requirements, we provide detailed quotes for data conversion."
#             },
#             {
#                 "question": "Are there any additional charges for adding extra features or modules?",
#                 "answer": "No, there are no additional charges for the features provided in your plan. These charges will be outlined in your subscription agreement."
#             },
#             {
#                 "question": "Do you offer discounts for long-term contracts or large volumes of users?",
#                 "answer": "Yes, we offer discounts for long-term contracts and large user volumes. Our sales team can provide pricing incentives based on the number of users and plan selection. Discounts are listed in our pricing calculator on our pricing page."
#             },
#             {
#                 "question": "Do you offer customization options, and if so, how are they priced?",
#                 "answer": "We do not offer customization, but we welcome feedback if you require a feature. We evaluate the feature request, determine if it matches our product offerings, and put it on the roadmap accordingly."
#             },
#             {
#                 "question": "Should we be aware of any hidden costs or charges?",
#                 "answer": "We strive to be transparent about our pricing structure, and there are no hidden costs or charges. However, reviewing your subscription agreement carefully is essential to understand any potential additional fees or charges that may apply based on your usage or requirements."
#             },
#             {
#                 "question": "Can we upgrade or downgrade our subscription plan as our needs change?",
#                 "answer": "Yes, you can upgrade or downgrade your subscription plan monthly or annually, depending on your selected term. Our customer success team will work with you to adjust your strategy and ensure a smooth transition without interruption to your service."
#             },
#             {
#                 "question": "Can we request a demo or trial of the Juntrax before committing to a subscription?",
#                 "answer": "Yes, we offer a 15-day free trial of Juntrax. Our sales team can provide you with access to a demo environment during the trial period so you can explore the platform and ensure it meets your requirements."
#             },
#             {
#                 "question": "What payment methods do you accept, and what are your billing terms?",
#                 "answer": "We accept various payment methods, including credit cards, bank transfers, and electronic payments. Your subscription agreement outlines our billing terms and typically involves monthly or annual billing cycles, depending on your preference. At the moment, we use Stripe for our payments."
#             },
#             {
#                 "question": "How do you handle support and maintenance?",
#                 "answer": "If you have any questions or encounter any issues with the product, you can submit them using the built-in ticketing mechanism. Our support team will review and respond based on the severity of the problem. Details will be outlined in your agreement. Software and maintenance will be conducted and updated automatically. New features or functionality will be provided based on the purchased plan."
#             },
#             {
#                 "question": "Do you have a knowledge base or user manual?",
#                 "answer": "We have a built-in knowledge base that is growing daily with tutorials and videos on using the functions and features of Juntrax. We aim to make it so intuitive that you will not need to use these collaterals."
#             }
# ]

# # Function to initialize the ChromaDB collection with FAQ data
# def initialize_collection():
#     try:
#         # Check if collection is empty
#         if collection.count() == 0:
#             questions = [qa["question"] for qa in FAQ_DATA]
#             answers = [qa["answer"] for qa in FAQ_DATA]
#             ids = [f"qa_{i}" for i in range(len(FAQ_DATA))]

#             # Add the documents to the collection
#             collection.add(
#                 documents=questions,  # The questions are the main documents
#                 metadatas=[{"answer": answer} for answer in answers],  # Store answers in metadata
#                 ids=ids
#             )
#             print(f"Initialized collection with {len(FAQ_DATA)} FAQ entries")
#         else:
#             print(f"Collection already contains {collection.count()} entries")
#     except Exception as e:
#         print(f"Error initializing collection: {e}")
#         raise

# # Initialize FastAPI app
# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.on_event("startup")
# async def startup_event():
#     # Initialize the collection when the app starts
#     initialize_collection()

# async def find_best_matches(query: str, n_results: int = 2):
#     try:
#         # Query the collection
#         results = collection.query(
#             query_texts=[query],
#             n_results=n_results,
#             include=["metadatas", "documents", "distances"]
#         )

#         # Format results
#         responses = []
#         if results and results['ids']:
#             for i in range(len(results['ids'][0])):
#                 qa_response = {
#                     "question": results['documents'][0][i],
#                     "answer": results['metadatas'][0][i]['answer']
#                 }
#                 responses.append(qa_response)

#         return responses
#     except Exception as e:
#         print(f"Error querying collection: {e}")
#         raise

# @app.post("/ask", response_model=BotResponse)
# async def ask_question(query: Query):
#     if not query.text.strip():
#         raise HTTPException(status_code=400, detail="Query text cannot be empty")

#     matches = await find_best_matches(query.text)
#     responses = [QAResponse(**qa) for qa in matches]
#     return BotResponse(responses=responses)

# @app.get("/health")
# async def health_check():
#     try:
#         # Check if ChromaDB is accessible
#         count = collection.count()
#         return {
#             "status": "healthy",
#             "collection_count": count
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database health check failed: {str(e)}")

# # Setup ngrok
# def setup_ngrok():
#     auth_token = "2pC36Zc0ySJHW42Dui5rwWkgyjn_5fm6HVYFoinapPBfk7np"  # Replace with your token
#     ngrok.set_auth_token(auth_token)
#     public_url = ngrok.connect(8000)
#     print(f'Public URL: {public_url}')
#     return public_url

# # Run the server
# if __name__ == "__main__":
#     public_url = setup_ngrok()
#     print(f"\nAPI is accessible at: {public_url}")
#     uvicorn.run(app, host="0.0.0.0", port=8000)