import pandas as pd
from collections import Counter
from Recommender.MarkovChainRecommender import MarkovChainRecommender
from Recommender.evaluator.evaluator import *
import seaborn as sns
import matplotlib.pyplot as plt
#Set to False for NoDebug information
_DEBUG=False

def read_dataset(name):
    df = pd.read_csv(name)
    df.interactionwu_prep = df.interactionwu_prep.apply(eval)
    return df


def main():
    users_df = pd.read_csv("Recommender/dataset/user_role.csv")
    user_dict = dict(zip(users_df.User, users_df.Role))

    df = read_dataset("Recommender/dataset/sequences_df_prep_simulated_EN.csv")
    cnt = Counter()
    df.interactionwu_prep.map(cnt.update);
    df["user_role"] = df.user.map(user_dict)

    sequence_length = df.interactionwu_prep.map(len).values
    n_sessions_per_user = df.groupby('user').size()
    print("Dataset information".center(40, "*"))
    print('Number of UI elements: {}'.format(len(cnt)))
    print('Number of users: {}'.format(len(df.user.unique())))
    print('Number of interaction sequences: {}'.format(len(df)))

    print('Sequence length:\n\tAverage: {:.2f}\n\tMedian: {}\n\tMin: {}\n\tMax: {}'.format(
        sequence_length.mean(),
        np.quantile(sequence_length, 0.5),
        sequence_length.min(),
        sequence_length.max()))

    print('Sequences per user:\n\tAverage: {:.2f}\n\tMedian: {}\n\tMin: {}\n\tMax: {}'.format(
        n_sessions_per_user.mean(),
        np.quantile(n_sessions_per_user, 0.5),
        n_sessions_per_user.min(),
        n_sessions_per_user.max()))

    print('Most used UI elements: {}'.format(cnt.most_common(5)))

    train, test = last_session_out_split(df)

    print("Train sessions: {} - Test sessions: {}".format(len(train), len(test)))

    execute_recommender(train, test, maxOrder=3)


def execute_recommender(train, test, maxOrder):

    list_MC = []
    for i in range(1, maxOrder + 1):
        mc_recommender = MarkovChainRecommender(i)
        if _DEBUG:
            mc_recommender.activate_debug_print()
        mc_recommender.fit(train)
        list_MC.append(mc_recommender)

    results_metrics = {"Metrics": [], "mean": [], "Model": [], "sd": []}
    for model in list_MC:
        results = eval_seqreveal(model, test)
        dicResults = {
            "Model": type(model).__name__,
            "ORDER" : model.order,
            "GIVEN_K": results[1],
            "LOOK_AHEAD": results[2],
            "STEP": results[3],
            "Precision@3": results[0][0][0],
            "Recall@3": results[0][0][1],
            "MRR@3": results[0][0][2],
        }
        metrics = ["Precision", "Recall", "MRR"]
        vector_results = results[0][1]
        for i, e in enumerate(metrics):
            results_metrics["Metrics"].append(e)
            results_metrics["Model"].append(model.name)
            results_metrics["mean"].append(vector_results[:, i].mean())
            results_metrics["sd"].append(vector_results[:, i].std())

        results_metrics["Metrics"].append("F1")
        results_metrics["Model"].append(model.name)
        results_metrics["mean"].append(f_measure(vector_results[:, 0].mean(), vector_results[:, 1].mean()))
        results_metrics["sd"].append(0)

        for k, v in dicResults.items():
            print("\t{}: {}".format(k,v))


    metrics_df = pd.DataFrame.from_dict(results_metrics)

    g = sns.catplot(data=metrics_df, x="Metrics", y="mean", hue="Model", aspect=0.6, kind="bar", height=4,
                    palette=sns.color_palette("deep"))
    g.set(ylim=(0, 1))
    plt.yticks([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
    plt.show()


if __name__ == "__main__":
    main()
