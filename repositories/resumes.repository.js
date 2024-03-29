class ResumesRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }
  /**
   * 1. Parameter
   * 2. DB 사용 로직
   * 4. Return 서비스 계층에 전달할 데이터
   */

  getAllResumes = async (orderKey, orderValue) => {
    const resumes = await this.prisma.resumes.findMany({
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: [
        {
          [orderKey]: orderValue,
        },
      ],
    });
    return resumes;
  };

  getResumeById = async (resumeId) => {
    const resume = await this.prisma.resumes.findFirst({
      where: {
        resumeId: +resumeId,
      },
      select: {
        resumeId: true,
        title: true,
        content: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return resume;
  };

  createResume = async (title, content, userId) => {
    const createdResume = await this.prisma.resumes.create({
      data: {
        title,
        content,
        status: "APPLY",
        userId,
      },
    });
    return createdResume;
  };

  updateResume = async (resumeId, title, content, status) => {
    const updatedResume = await this.prisma.resumes.update({
      where: {
        resumeId: +resumeId,
      },
      data: {
        title,
        content,
        status,
      },
    });
    return updatedResume;
  };

  deleteResume = async (resumeId) => {
    const deletedResume = await this.prisma.resumes.delete({
      where: {
        resumeId: +resumeId,
      },
    });
    return deletedResume;
  };
}

module.exports = ResumesRepository;
