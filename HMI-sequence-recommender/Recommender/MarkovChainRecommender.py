from Recommender.graph.graphFunctions import *
import logging


class MarkovChainRecommender():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.getLogger('matplotlib.font_manager').setLevel(logging.ERROR)
    logging.getLogger('PIL').setLevel(logging.ERROR)
    logger = logging.getLogger()

    def __init__(self, order):
        """
        :param order: the order of the Markov Chain
        """
        super(MarkovChainRecommender, self).__init__()
        self.order = order
        self.name = "MC order {}".format(self.order)

    def fit(self, train_data):

        sequences = train_data.interactionwu_prep.values
        logging.debug('Building Markov Chain model ' + str(self.order))
        logging.debug('Adding nodes')
        self.count_dict, self.G = add_nodes_to_graph_ngrams(sequences, self.order)
        # Visualizing is only possible in 1st Order
        if self.order == 1:
            show_graph(self.G)

    def recommend(self, user_profile, user_id=None):
        # if the user profile is longer than the markov order, chop it keeping recent history
        state = tuple(user_profile[-self.order:])
        # see if graph has that state
        recommendations = []
        last = state  # tuple([state[-1]])
        if self.G.has_node(last):
            # search for recommendations in the forward star
            rec_dict = {}
            for u, v in self.G.edges([last]):
                lastElement = tuple(v[-1:])
                rec_dict[lastElement] = self.G[u][v]['probability']  # *prob
            for k, v in rec_dict.items():
                recommendations.append((list(k), v))

        rec_dict = {}
        recommendations2 = []
        for i in recommendations:
            rec_dict.setdefault(tuple(i[0]), 0)
            rec_dict[tuple(i[0])] += i[1]
        # Sort by probability value
        for k, v in dict(sorted(rec_dict.items(), key=lambda item: item[1], reverse=True)).items():
            recommendations2.append((list(k), v))

        return recommendations2

    def _set_graph_debug(self, G):
        self.G = G

    @staticmethod
    def get_recommendation_list(recommendation):
        return list(map(lambda x: x[0], recommendation))

    @staticmethod
    def get_recommendation_confidence_list(recommendation):
        return list(map(lambda x: x[1], recommendation))

    def activate_debug_print(self):
        self.logger.setLevel(logging.DEBUG)

    def deactivate_debug_print(self):
        self.logger.setLevel(logging.INFO)
